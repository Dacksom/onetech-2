"use client";

import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  Headset,
  FileText,
  Settings,
  ChevronRight,
  LogOut,
  Shield,
} from "lucide-react";
import { useOrders } from "@/store/orders";

export default function AccountPage() {
  const orders = useOrders((s) => s.list);

  return (
    <div className="pb-6">
      <header className="px-5 pt-6 pb-3">
        <span className="brand-label">Mi cuenta</span>
      </header>

      {/* User card */}
      <section className="px-5">
        <div className="relative rounded-3xl bg-brand-gradient text-white p-5 overflow-hidden">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3 relative">
            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-[18px] font-medium tracking-tight">
              👤
            </div>
            <div>
              <div className="text-[15px] font-medium tracking-tight">
                Invitado
              </div>
              <div className="text-[11.5px] text-white/75">
                Inicia sesión para ver tus pedidos
              </div>
            </div>
          </div>
          <div className="mt-4 relative grid grid-cols-3 gap-2 text-center">
            <Stat label="Órdenes" value={`${orders.length}`} />
            <Stat
              label="Ahorros"
              value={`$${orders
                .reduce((n, o) => n + o.discount, 0)
                .toFixed(0)}`}
            />
            <Stat label="Sede" value="Maracaibo" />
          </div>
        </div>
      </section>

      <section className="mt-5 px-5 space-y-2">
        <Item
          icon={<Package size={16} />}
          label="Mis pedidos"
          sub={`${orders.length} en total`}
          href={orders[0] ? `/order/${orders[0].id}` : "/catalog"}
        />
        <Item icon={<Heart size={16} />} label="Guardados" href="/saved" />
        <Item icon={<MapPin size={16} />} label="Direcciones" href="#" />
        <Item icon={<FileText size={16} />} label="Facturas" href="#" />
        <Item icon={<Headset size={16} />} label="Soporte" href="#" />
      </section>

      <section className="mt-5 px-5">
        <span className="brand-label">Staff</span>
        <div className="mt-2 space-y-2">
          <Item
            icon={<Shield size={16} />}
            label="Panel de gestión"
            sub="Inventario · Transferencias · Cotizaciones"
            href="/admin"
          />
          <Item icon={<Settings size={16} />} label="Configuración" href="#" />
          <Item
            icon={<LogOut size={16} />}
            label="Cerrar sesión"
            href="#"
            danger
          />
        </div>
      </section>

      <div className="mt-8 text-center text-[10.5px] text-ink-subtle tracking-[0.12em] uppercase">
        ONETECH Venezuela · v1.0.0
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[16px] font-medium tracking-tight font-mono">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/70">
        {label}
      </div>
    </div>
  );
}

function Item({
  icon,
  label,
  sub,
  href,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  href: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-white border-hairline border-black/8 p-3.5 shadow-soft tap"
    >
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center ${
          danger ? "bg-danger/10 text-danger" : "bg-surface-active text-brand-deep"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-[13px] font-medium tracking-tight ${
            danger ? "text-danger" : "text-ink"
          }`}
        >
          {label}
        </div>
        {sub && <div className="text-[10.5px] text-ink-muted">{sub}</div>}
      </div>
      <ChevronRight size={16} className="text-ink-subtle" strokeWidth={1.5} />
    </Link>
  );
}
