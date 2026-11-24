import Link from "next/link";
import { notFound } from "next/navigation";
import { saunas } from "@/data/saunas";
import OrderForm from "@/components/OrderForm";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU").format(price) + " ₽";

export function generateStaticParams() {
  return saunas.map((sauna) => ({ id: String(sauna.id) }));
}

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const sauna = saunas.find((item) => item.id === Number(id));

  if (!sauna) notFound();

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#28291f]">
      <header className="border-b border-[#e8e5dc] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            БАНИ<span className="text-[#a47745]">.</span>
            <span className="block text-xs font-normal tracking-[0.3em] text-gray-500">В ПЕНЗЕ</span>
          </Link>
          <Link href="/catalog" className="text-sm text-gray-600 transition hover:text-[#a47745]">← В каталог</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#a47745]">Главная</Link>
          <span className="mx-2">/</span>
          <Link href="/catalog" className="hover:text-[#a47745]">Каталог</Link>
          <span className="mx-2">/</span>
          <span>{sauna.name}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-3xl bg-[#e7e1d5]">
              {/* Главное фото товара — приоритетная загрузка */}
              <img src={sauna.images[0]} alt={sauna.name} fetchPriority="high" decoding="async"
                className="h-[420px] w-full object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {sauna.images.slice(1).map((image, index) => (
                <div key={image} className="overflow-hidden rounded-2xl bg-[#e7e1d5]">
                  {/* Остальные фото — только когда попали в viewport */}
                  <img src={image} alt={`${sauna.name} — фото ${index + 2}`} loading="lazy" decoding="async"
                    className="h-40 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a47745]">{sauna.type}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{sauna.name}</h1>
            <p className="mt-4 text-lg leading-8 text-gray-500">{sauna.subtitle}</p>
            <p className="mt-8 text-sm text-gray-400">Стоимость</p>
            <p className="mt-1 text-3xl font-semibold">от {formatPrice(sauna.price)}</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm text-gray-400">Габариты</p>
                <p className="mt-2 font-semibold">{sauna.dimensions}</p>
              </div>
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm text-gray-400">Площадь</p>
                <p className="mt-2 font-semibold">{String(sauna.area).replace(".", ",")} м²</p>
              </div>
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm text-gray-400">Вместимость</p>
                <p className="mt-2 font-semibold">до {sauna.capacity} чел.</p>
              </div>
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm text-gray-400">Доставка</p>
                <p className="mt-2 font-semibold">По Пензе</p>
              </div>
            </div>

            <a
              href="#order"
              className="mt-8 inline-flex rounded-full bg-[#30382c] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#a47745]"
            >
              Оставить заявку →
            </a>
            <p className="mt-4 max-w-md text-xs leading-5 text-gray-400">
              Онлайн-оплаты на сайте нет: после заявки мы свяжемся с вами и обсудим детали.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-[#e3dfd5] pt-12 md:grid-cols-[1fr_340px]">
          <div>
            <h2 className="text-2xl font-semibold">О модели</h2>
            <p className="mt-5 max-w-3xl leading-8 text-gray-600">{sauna.description}</p>
          </div>
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-lg font-semibold">Особенности</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
              {sauna.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
            </ul>
          </div>
        </div>

        <div id="order" className="mt-16 scroll-mt-8 grid gap-10 border-t border-[#e3dfd5] pt-12 lg:grid-cols-[1fr_480px]">
          <div>
            <h2 className="text-3xl font-semibold">Оставить заявку на эту баню</h2>
            <p className="mt-5 max-w-lg leading-8 text-gray-600">
              Укажите имя и телефон, мы перезвоним, уточним комплектацию,
              сроки изготовления и условия доставки. Если нужно что-то
              изменить в модели, напишите об этом в комментарии.
            </p>
          </div>
          <OrderForm model={sauna.name} />
        </div>
      </section>

      <footer className="mt-10 border-t border-[#e8e5dc] bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-6 text-sm text-gray-500">
          <p>© 2026 Бани в Пензе</p><p>Доставка по Пензе</p>
        </div>
      </footer>
    </main>
  );
}