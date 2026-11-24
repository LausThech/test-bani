import Link from "next/link";
import { saunas } from "@/data/saunas";
import OrderForm from "@/components/OrderForm";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU").format(price) + " ₽";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#28291f]">
      {/* HEADER */}
      <header className="border-b border-[#e8e5dc]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            БАНИ<span className="text-[#a47745]">.</span>
            <span className="block text-xs font-normal tracking-[0.3em] text-gray-500">
              В ПЕНЗЕ
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-sm md:flex">
            <Link href="/catalog" className="hover:text-[#a47745]">Каталог</Link>
            <a href="#advantages" className="hover:text-[#a47745]">Преимущества</a>
            <a href="#custom" className="hover:text-[#a47745]">Баня на заказ</a>
            <a href="#contacts" className="hover:text-[#a47745]">Контакты</a>
          </nav>

          <a
            href="#contacts"
            className="rounded-full bg-[#30382c] px-6 py-3 text-sm text-white transition hover:bg-[#a47745]"
          >
            Оставить заявку
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#a47745]">
            Мобильные бани · Пенза
          </p>

          <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
            Ваша собственная
            <span className="block text-[#a47745]">баня.</span>
            Где угодно.
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-gray-600">
            Современные мобильные бани из натурального дерева.
            Комфорт, качество и уют прямо на вашем участке.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="rounded-full bg-[#30382c] px-8 py-4 text-white transition hover:bg-[#a47745]"
            >
              Выбрать баню →
            </Link>

            <a
              href="#custom"
              className="rounded-full border border-[#b9b4a8] px-8 py-4 transition hover:bg-[#eeece5]"
            >
              Создать свою
            </a>
          </div>

          <div className="mt-14 flex gap-12">
            <div>
              <p className="text-3xl font-semibold">100%</p>
              <p className="mt-1 text-sm text-gray-500">Натуральное дерево</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">Пенза</p>
              <p className="mt-1 text-sm text-gray-500">Местное производство</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[32px] bg-[#e7e1d5] md:min-h-[520px]">
          <img
            src="/images/sauna-1.jpg"
            alt="Мобильная баня изнутри"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-7 pt-20">
            <span className="text-xs uppercase tracking-[0.3em] text-white/90">
              Натуральность · Комфорт · Качество
            </span>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#a47745]">
                Наша коллекция
              </p>
              <h2 className="text-4xl font-semibold md:text-5xl">
                Выберите свою баню
              </h2>
            </div>

            <p className="max-w-sm text-gray-500">
              Продуманные модели мобильных бань для вашего загородного отдыха.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {saunas.slice(0, 3).map((sauna) => (
              <article
                key={sauna.id}
                className="group overflow-hidden rounded-2xl border border-[#e9e6de] bg-[#f8f7f3] transition hover:-translate-y-2 hover:shadow-xl"
              >
                <Link
                  href={`/product/${sauna.id}`}
                  className="block h-64 overflow-hidden bg-[#e7e1d5]"
                >
                  <img
                    src={sauna.images[0]}
                    alt={sauna.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>

                <div className="p-7">
                  <p className="text-sm text-[#a47745]">{sauna.dimensions}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{sauna.name}</h3>

                  <p className="mt-4 min-h-12 text-sm leading-6 text-gray-500">
                    {sauna.subtitle}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-[#e3dfd5] pt-5">
                    <span className="font-semibold">
                      от {formatPrice(sauna.price)}
                    </span>
                    <Link
                      href={`/product/${sauna.id}`}
                      className="text-sm font-medium text-[#a47745] hover:underline"
                    >
                      Подробнее →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalog"
              className="inline-flex rounded-full border border-[#b9b4a8] px-8 py-4 transition hover:bg-[#eeece5]"
            >
              Весь каталог →
            </Link>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm uppercase tracking-[0.25em] text-[#a47745]">
            Почему мы
          </p>

          <h2 className="mt-4 text-4xl font-semibold">
            Баня, созданная для вашего отдыха
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              ["01", "Натуральные материалы", "Используем качественные материалы и продумываем каждую деталь."],
              ["02", "Мобильная конструкция", "Компактное решение для размещения на вашем загородном участке."],
              ["03", "Индивидуальный подход", "Поможем подобрать комплектацию под ваши пожелания."],
            ].map(([number, title, description]) => (
              <div key={number} className="border-t border-[#c9c3b5] pt-7">
                <p className="text-sm text-[#a47745]">{number}</p>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-4 leading-7 text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM ORDER */}
      <section id="custom" className="bg-[#30382c] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#c9a77c]">
              Индивидуальный проект
            </p>

            <h2 className="mt-5 max-w-2xl text-4xl font-semibold md:text-5xl">
              Не нашли подходящую модель?
              Создадим баню под ваши пожелания.
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-gray-300">
              Расскажите, какую баню вы хотите получить,
              а мы обсудим возможности её изготовления.
            </p>
          </div>

          <a
            href="#contacts"
            className="mt-10 inline-block whitespace-nowrap rounded-full bg-[#c49a69] px-9 py-5 font-medium text-[#24271f] transition hover:bg-white md:mt-0"
          >
            Создать свою баню →
          </a>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[#a47745]">
            Свяжитесь с нами
          </p>

          <h2 className="mt-5 text-4xl font-semibold md:text-5xl">
            Ваша баня начинается здесь
          </h2>

          <p className="mx-auto mt-6 max-w-xl leading-7 text-gray-500">
            Оставьте заявку, и мы свяжемся с вами,
            чтобы обсудить подходящую модель или индивидуальный проект.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <OrderForm />
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Или позвоните:{" "}
            <a href="tel:+70000000000" className="font-medium text-[#a47745] hover:underline">
              +7 000 000-00-00
            </a>
          </p>

          <p className="mt-3 text-xs text-gray-400">
            Работаем в Пензе и Пензенской области
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e8e5dc] py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-6 text-sm text-gray-500">
          <p>© 2026 Бани в Пензе</p>
          <p>Мобильные бани для вашего загородного отдыха</p>
        </div>
      </footer>
    </main>
  );
}
