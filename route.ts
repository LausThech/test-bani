import { NextResponse } from "next/server";
import https from "node:https";

// Простая защита от спама
const requests = new Map<string, number[]>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (requests.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= RATE_LIMIT) {
    requests.set(ip, list);
    return true;
  }
  list.push(now);
  requests.set(ip, list);
  return false;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "local";
}

// Надёжная отправка через https модуль (лучше работает на Windows)
function sendTelegramMessage(token: string, chatId: string, text: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ chat_id: chatId, text });

    const req = https.request(
      {
        hostname: "api.telegram.org",
        path: `/bot${token}/sendMessage`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
        timeout: 15000,
        family: 4, // принудительно IPv4
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error("Не удалось разобрать ответ Telegram"));
          }
        });
      }
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout"));
    });

    req.write(data);
    req.end();
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
    }

    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    if (isRateLimited(clientIp(request))) {
      return NextResponse.json(
        { error: "Слишком много заявок. Попробуйте через минуту." },
        { status: 429 }
      );
    }

    const name = String(body.name ?? "").trim().slice(0, 100);
    const phone = String(body.phone ?? "").trim().slice(0, 30);
    const comment = String(body.comment ?? "").trim().slice(0, 1000);
    const model = String(body.model ?? body.product ?? "").trim().slice(0, 100);

    if (name.length < 2) {
      return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
    }

    if (phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "Укажите телефон полностью, например +7 900 000-00-00" },
        { status: 400 }
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!token || !chatId) {
      console.error("Не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
      return NextResponse.json(
        { error: "Заявки временно не принимаются. Позвоните нам." },
        { status: 500 }
      );
    }

    const message = [
      "🆕 Новая заявка с сайта «Бани в Пензе»",
      "",
      `Баня: ${model || "не выбрана (общая заявка)"}`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Комментарий: ${comment || "—"}`,
    ].join("\n");

    console.log(`[order] ${new Date().toISOString()} | ${name} | ${phone} | ${model || "-"}`);

    try {
      console.log("Отправляю в Telegram через https...");
      const result = await sendTelegramMessage(token, chatId, message);

      console.log("Ответ Telegram:", result);

      if (!result?.ok) {
        console.error("Ошибка Telegram:", result);
        return NextResponse.json(
          { error: "Не удалось отправить заявку. Попробуйте позже или позвоните нам." },
          { status: 502 }
        );
      }

      return NextResponse.json({
        ok: true,
        message: "Заявка успешно отправлена",
      });
    } catch (err) {
      console.error("Сеть/Telegram недоступен:", err);
      return NextResponse.json(
        { error: "Не удалось отправить заявку. Проверьте интернет и попробуйте позже." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Ошибка API заявок:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}