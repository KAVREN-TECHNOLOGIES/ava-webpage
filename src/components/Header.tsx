import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../lib/language";
import { Icon } from "./Icon";

export function Header({ cover = false }: { cover?: boolean }) {
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (event.key !== "Tab") return;
      const links = drawer.current?.querySelectorAll<HTMLElement>("a");
      if (!links?.length) return;
      if ((event.shiftKey && document.activeElement === links[0]) ||
          (!event.shiftKey && document.activeElement === links[links.length - 1])) {
        event.preventDefault();
        trigger.current?.focus();
      } else if (document.activeElement === trigger.current) {
        event.preventDefault();
        (event.shiftKey ? links[links.length - 1] : links[0]).focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    { to: "/procedimientos", hash: "#ap-procedimientos", label: t("Procedimientos", "Procedures") },
    { to: "/servicios", hash: "#ap-experiencia", label: t("Preparación", "Preparation") },
    { to: "/recursos", hash: "#ap-preguntas", label: t("Preguntas", "Questions") },
  ];
  const moreLinks = [
    { to: "/financiamiento", label: t("Costos de cirugía", "Surgery costs") },
    { to: "/resultados", label: t("Fotografías", "Photography") },
    { to: "/ubicacion", label: t("Pacientes de otras ciudades", "Traveling patients") },
  ];
  return (
    <>
      {!cover && <a className="skip-link" href="#contenido">{t("Saltar al contenido", "Skip to content")}</a>}
      <header className={`ap-header ${cover ? "ap-header--cover" : "ap-header--interior"}`}>
        <Link className="ap-logo" to="/" aria-label="AVA Cosmetic Surgery · Inicio">
          <img src="/brand/ava-lockup-ivory.svg" alt="" width="119" height="57" />
        </Link>
        <nav className="ap-desktop-nav" aria-label={t("Navegación principal", "Main navigation")}>
          {links.map(link => cover ?
            <a key={link.to} href={link.hash}>{link.label}</a> :
            <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
          )}
        </nav>
        <div className="ap-header__actions">
          <button className="ap-language" onClick={() => setLanguage(language === "es" ? "en" : "es")}
            aria-label={language === "es" ? "View in English" : "Ver en español"}>
            {language === "es" ? "EN" : "ES"}
          </button>
          {cover ? <a className="ap-header__cta" href="#ap-consulta">{t("Consulta", "Consultation")}<Icon name="arrow" /></a> :
            <Link className="ap-header__cta" to="/consulta">{t("Consulta", "Consultation")}<Icon name="arrow" /></Link>}
          <button ref={trigger} className="ap-menu-toggle" aria-label={t(open ? "Cerrar menú" : "Abrir menú", open ? "Close menu" : "Open menu")}
            aria-controls="ap-mobile-nav" aria-expanded={open} onClick={() => open ? close() : setOpen(true)}>
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
        {open && <nav ref={drawer} id="ap-mobile-nav" className="ap-mobile-nav" aria-label={t("Menú móvil", "Mobile menu")}>
          {links.map(link => <Link key={link.to} to={link.to} onClick={close}>{link.label}<Icon name="arrow" /></Link>)}
          {moreLinks.map(link => <Link key={link.to} to={link.to} onClick={close}>{link.label}<Icon name="arrow" /></Link>)}
          <Link to="/consulta" onClick={close}>{t("Preparar mi consulta", "Prepare my consultation")}<Icon name="arrow" /></Link>
        </nav>}
      </header>
    </>
  );
}
