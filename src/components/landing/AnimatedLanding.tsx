import {
  BarChart3,
  Boxes,
  Check,
  ChevronDown,
  CreditCard,
  Search,
  ShoppingBag,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { RiSecurePaymentLine } from "react-icons/ri";
import {
  SiClerk,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiSupabase,
  SiTrpc,
  SiTypescript,
} from "react-icons/si";

const products = [
  {
    name: "Iced matcha",
    category: "Drinks",
    price: "Rp28.000",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Butter croissant",
    category: "Bakery",
    price: "Rp24.000",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Chicken sando",
    category: "Kitchen",
    price: "Rp42.000",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Cold brew",
    category: "Drinks",
    price: "Rp30.000",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80",
  },
];

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function PosHeroPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [24, -20]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -3]);

  return (
    <div
      ref={ref}
      className="relative min-h-[440px] [perspective:1400px] sm:min-h-[500px] lg:min-h-[560px]"
    >
      <motion.div
        data-ui
        style={reduced ? undefined : { y, rotateX }}
        initial={
          reduced ? false : { opacity: 0, rotateY: 7, rotateX: 5, scale: 0.94 }
        }
        animate={{ opacity: 1, rotateY: -4, rotateX: 2, scale: 1 }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 top-4 origin-center overflow-hidden rounded-[18px] bg-[#101112] p-2 shadow-[0_34px_80px_-48px_rgba(0,0,0,.65)] ring-1 ring-white/15"
      >
        <div className="flex h-9 items-center gap-2 px-3 text-white/45">
          <span className="size-2.5 rounded-full bg-[#ff6b60]" />
          <span className="size-2.5 rounded-full bg-[#f8c555]" />
          <span className="size-2.5 rounded-full bg-[#63d98a]" />
          <span className="ml-3 text-[11px]">simple-pos / counter</span>
        </div>
        <div className="grid min-h-[390px] overflow-hidden rounded-[11px] bg-[#f7f7f4] text-black sm:grid-cols-[112px_1fr_155px] lg:min-h-[470px] lg:grid-cols-[125px_1fr_170px]">
          <aside className="hidden bg-[#151615] p-4 text-white sm:flex sm:flex-col">
            <div className="flex items-center gap-2 font-bold">
              <span className="grid size-7 place-items-center rounded-md bg-[#b9efa8] text-black">
                <ShoppingBag className="size-3.5" />
              </span>
              POS
            </div>
            <div className="mt-9 space-y-1 text-xs">
              <div className="rounded-md bg-white px-3 py-2.5 font-semibold text-black">
                New order
              </div>
              <div className="px-3 py-2.5 text-white/50">Products</div>
              <div className="px-3 py-2.5 text-white/50">Categories</div>
              <div className="px-3 py-2.5 text-white/50">Sales</div>
            </div>
            <div className="mt-auto rounded-md bg-white/6 p-3 text-[10px] text-white/55">
              <span className="mb-2 block size-2 rounded-full bg-[#b9efa8]" />
              Counter is online
            </div>
          </aside>
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-extrabold tracking-tight lg:text-xl">
                  New order
                </p>
                <p className="text-[11px] text-black/50">
                  Wednesday, 4 November
                </p>
              </div>
              <div className="rounded-md bg-black px-3 py-2 text-xs font-semibold text-white sm:hidden">
                Cart · 2
              </div>
            </div>
            <div className="mt-5 flex h-9 items-center gap-2 rounded-md bg-black/5 px-3 text-xs text-black/50">
              <Search className="size-3.5" />
              Search menu
            </div>
            <div className="mt-3 flex gap-1.5 overflow-hidden text-[10px]">
              <span className="rounded-md bg-black px-3 py-2 text-white">
                All 12
              </span>
              <span className="rounded-md bg-black/5 px-3 py-2">Drinks 5</span>
              <span className="rounded-md bg-black/5 px-3 py-2">Bakery 4</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {products.map((product) => (
                <motion.div
                  key={product.name}
                  whileHover={reduced ? undefined : { y: -5, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  className="group rounded-lg bg-white p-1.5 shadow-[0_1px_0_rgba(0,0,0,.08)] ring-1 ring-black/8"
                >
                  <div className="relative aspect-[1.5] overflow-hidden rounded-md">
                    <img
                      src={product.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full bg-white/90 text-[10px]">
                      +
                    </span>
                  </div>
                  <div className="p-1.5">
                    <p className="truncate text-[11px] font-bold lg:text-xs">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-[9px] text-black/45">
                      {product.category}
                    </p>
                    <p className="mt-1.5 text-[10px] font-bold tabular-nums lg:text-xs">
                      {product.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <aside className="hidden border-l border-black/8 bg-white p-4 sm:block lg:p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Current order</p>
              <span className="rounded-full bg-[#b9efa8] px-2 py-1 text-[9px] font-bold">
                2 items
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {products.slice(0, 2).map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <img
                    src={p.image}
                    alt=""
                    className="size-9 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-bold">{p.name}</p>
                    <p className="text-[9px] text-black/45">1 × {p.price}</p>
                  </div>
                  <Check className="size-3 text-black/35" />
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-black/8 pt-4 text-[10px]">
              <div className="flex justify-between text-black/45">
                <span>Subtotal</span>
                <span>Rp52.000</span>
              </div>
              <div className="mt-2 flex justify-between text-sm font-extrabold">
                <span>Total</span>
                <span>Rp52.000</span>
              </div>
            </div>
            <div className="mt-5 grid h-10 w-full place-items-center rounded-md bg-black text-xs font-bold text-white">
              Continue to payment
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-black/40">
              <RiSecurePaymentLine />
              QRIS ready
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}

const featureItems = [
  {
    icon: ShoppingBag,
    title: "Ordering",
    text: "Search the menu, filter categories, build a cart, and keep checkout one action away.",
    tone: "bg-[#dff7d8] text-[#17351f]",
    iconTone: "bg-[#17351f] text-[#b9efa8]",
  },
  {
    icon: Boxes,
    title: "Catalog",
    text: "Manage products, images, prices, and categories through a responsive operating table.",
    tone: "bg-[#fff0c9] text-[#452d02]",
    iconTone: "bg-[#452d02] text-[#ffd16a]",
  },
  {
    icon: CreditCard,
    title: "Payments",
    text: "Create QRIS payments in the same flow and keep every transaction attached to its order.",
    tone: "bg-[#ffe0d8] text-[#521f17]",
    iconTone: "bg-[#521f17] text-[#ffb29e]",
  },
  {
    icon: BarChart3,
    title: "Sales",
    text: "Read revenue, active orders, completed sales, and status changes without leaving the workspace.",
    tone: "bg-[#dcecff] text-[#152f4d]",
    iconTone: "bg-[#152f4d] text-[#9acbff]",
  },
];

export function FeatureRail() {
  const reduced = useReducedMotion();
  return (
    <div className="flex snap-x gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
      {featureItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.article
            key={item.title}
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.55 }}
            whileHover={
              reduced ? undefined : { y: -10, rotate: i % 2 ? 1 : -1 }
            }
            className={`group min-w-[82vw] snap-center rounded-[18px] p-6 sm:min-w-[360px] lg:min-w-0 ${item.tone}`}
          >
            <div className="flex min-h-[280px] flex-col">
              <span
                className={`grid size-16 place-items-center rounded-2xl ${item.iconTone}`}
              >
                <Icon
                  className="size-8 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  strokeWidth={1.75}
                />
              </span>
              <div className="mt-auto">
                <h3 className="text-4xl font-black tracking-[-.05em]">
                  {item.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed font-medium opacity-70">
                  {item.text}
                </p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

const technologies = [
  { name: "Next.js", icon: SiNextdotjs, tone: "bg-white text-black" },
  { name: "TypeScript", icon: SiTypescript, tone: "bg-[#3178c6] text-white" },
  { name: "tRPC", icon: SiTrpc, tone: "bg-[#398ccb] text-white" },
  { name: "Prisma", icon: SiPrisma, tone: "bg-[#16324f] text-white" },
  { name: "PostgreSQL", icon: SiPostgresql, tone: "bg-[#336791] text-white" },
  { name: "Clerk", icon: SiClerk, tone: "bg-[#6c47ff] text-white" },
  { name: "Supabase", icon: SiSupabase, tone: "bg-[#123b2e] text-[#3ecf8e]" },
  {
    name: "Xendit",
    icon: RiSecurePaymentLine,
    tone: "bg-[#3154d5] text-white",
  },
];
export function StackOrbit() {
  const reduced = useReducedMotion();
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {technologies.map(({ name, icon: Icon, tone }, i) => (
        <motion.div
          key={name}
          whileHover={reduced ? undefined : { y: -5, scale: 1.02 }}
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          className="group flex min-h-40 flex-col justify-between rounded-xl bg-[#242724] p-5 ring-1 ring-white/10"
        >
          <span
            className={`grid size-12 place-items-center rounded-xl ${tone}`}
          >
            <Icon className="size-7 transition-transform duration-300 group-hover:scale-110" />
          </span>
          <span className="font-bold text-[#f4f1e8]">{name}</span>
        </motion.div>
      ))}
    </div>
  );
}

const faqs = [
  [
    "What does Simple POS cover?",
    "Ordering, product and category management, QRIS checkout, and sales monitoring are connected in one authenticated application.",
  ],
  [
    "Is this a production service?",
    "It is a working portfolio build. It demonstrates the product architecture and end-to-end flows without presenting invented customer claims.",
  ],
  [
    "Does it support light and dark themes?",
    "Yes. It follows the device theme on first visit and lets you switch directly between light and dark.",
  ],
  [
    "Which payment flow is included?",
    "The checkout integrates Xendit QRIS and displays the payment code inside the current order flow.",
  ],
];
export function FaqList() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {faqs.map(([q, a], i) => (
        <div key={q} className="border-border border-t px-6 py-2">
          <button
            id={`faq-trigger-${i}`}
            className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-bold"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            aria-controls={`faq-panel-${i}`}
          >
            {q}
            <motion.span aria-hidden animate={{ rotate: open === i ? 180 : 0 }}>
              <ChevronDown className="size-5" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-muted-foreground max-w-2xl pb-6 leading-relaxed">
                  {a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
