"use client";

import { useState } from "react";

type OrderFormProps = {
  model?: string;
};

type Status = "idle" | "sending" | "success" | "error";

export default function OrderForm({ model }: OrderFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    // Быстрая клиентская проверка телефона: минимум 10 цифр
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");
    if (phone.length < 10) {
      setError("Укажите телефон полностью, например +7 900 000-00-00");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          comment: data.get("comment"),
          website: data.get("website"),
          model,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Не удалось отправить заявку");
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось отправить заявку"
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#e8e5dc] bg-white p-8 text-left">
        <h3 className="text-xl font-semibold">Заявка отправлена</h3>
        <p className="mt-3 leading-7 text-gray-500">
          Мы получили вашу заявку и свяжемся с вами в ближайшее время.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-[#a47745] hover:underline"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#e8e5dc] bg-white p-8 text-left"
    >
      {model && (
        <p className="mb-6 rounded-xl bg-[#f7f6f2] px-4 py-3 text-sm">
          Модель: <span className="font-semibold">{model}</span>
        </p>
      )}

      <label className="block text-sm font-medium">
        Ваше имя
        <input
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          placeholder="Иван"
          className="mt-2 w-full rounded-xl border border-[#dedbd2] px-4 py-3 text-sm outline-none transition focus:border-[#a47745]"
        />
      </label>

      <label className="mt-5 block text-sm font-medium">
        Телефон
        <input
          name="phone"
          type="tel"
          required
          maxLength={30}
          autoComplete="tel"
          placeholder="+7 900 000-00-00"
          className="mt-2 w-full rounded-xl border border-[#dedbd2] px-4 py-3 text-sm outline-none transition focus:border-[#a47745]"
        />
      </label>

      <label className="mt-5 block text-sm font-medium">
        Комментарий (необязательно)
        <textarea
          name="comment"
          rows={3}
          maxLength={1000}
          placeholder="Например: нужна доставка в Заречный, интересует печь на дровах"
          className="mt-2 w-full resize-none rounded-xl border border-[#dedbd2] px-4 py-3 text-sm outline-none transition focus:border-[#a47745]"
        />
      </label>

      {/* Ловушка для спам-ботов: людям не видна */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {status === "error" && (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-full bg-[#30382c] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#a47745] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Отправляем..." : "Отправить заявку"}
      </button>

      <p className="mt-4 text-xs leading-5 text-gray-400">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных для
        связи с вами по заявке.
      </p>
    </form>
  );
}