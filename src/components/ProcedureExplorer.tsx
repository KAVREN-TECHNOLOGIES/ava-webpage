import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Link } from "react-router-dom";
import { categoryLabels, procedures, type Procedure } from "../data/procedures";
import { useLanguage } from "../lib/language";
import { Icon } from "./Icon";

type Category = Procedure["category"];
const categories: readonly Category[] = ["body", "breast", "face"];
export function ProcedureExplorer() {
  const { t, language } = useLanguage();
  const [category, setCategory] = useState<Category>("body");
  const items = useMemo(
    () => procedures.filter((item) => item.category === category),
    [category],
  );
  const track = useRef<HTMLDivElement>(null);
  const pendingOffset = useRef<number | null>(null);
  const [position, setPosition] = useState(0);
  const [lastPosition, setLastPosition] = useState(items.length - 1);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => {
      const card = element.firstElementChild as HTMLElement | null;
      if (!card?.offsetWidth || !element.clientWidth) return;
      pendingOffset.current = null;
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
      const visible = Math.max(
        1,
        Math.floor((element.clientWidth + gap) / (card.offsetWidth + gap)),
      );
      const last = Math.max(0, items.length - visible);
      setLastPosition(last);
      setPosition((current) => Math.min(current, last));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [items.length]);

  const goTo = (requested: number) => {
    const next = Math.max(0, Math.min(requested, lastPosition));
    setPosition(next);
    const element = track.current;
    const card = element?.children[next] as HTMLElement | undefined;
    if (!element || !card) return;
    const left = Math.min(
      card.offsetLeft,
      Math.max(0, element.scrollWidth - element.clientWidth),
    );
    pendingOffset.current = left;
    element.scrollTo?.({
      left,
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  const synchronizeScroll = () => {
    const element = track.current;
    const card = element?.firstElementChild as HTMLElement | null;
    if (!element || !card?.offsetWidth) return;
    if (
      pendingOffset.current !== null &&
      Math.abs(element.scrollLeft - pendingOffset.current) > 2
    )
      return;
    pendingOffset.current = null;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    const atEnd =
      element.scrollWidth - element.clientWidth - element.scrollLeft < 2;
    setPosition(
      atEnd
        ? lastPosition
        : Math.min(
            lastPosition,
            Math.round(element.scrollLeft / (card.offsetWidth + gap)),
          ),
    );
  };

  const changeCategory = (next: Category) => {
    pendingOffset.current = null;
    setCategory(next);
    setPosition(0);
    setLastPosition(
      procedures.filter((item) => item.category === next).length - 1,
    );
    track.current?.scrollTo?.({ left: 0, behavior: "instant" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const destinations: Record<string, number> = {
      ArrowLeft: position - 1,
      ArrowRight: position + 1,
      Home: 0,
      End: lastPosition,
    };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    goTo(destinations[event.key]);
  };

  const descriptions: Record<Category, string> = {
    body: t(
      "Cirugías para modificar el volumen, retirar grasa localizada y tratar el exceso de piel.",
      "Surgery to change volume, remove localized fat and address excess skin.",
    ),
    breast: t(
      "Aumento, elevación y reducción de pecho: tres procedimientos con objetivos distintos.",
      "Breast augmentation, lift and reduction: three procedures with different goals.",
    ),
    face: t(
      "Cirugía de nariz y lifting facial: cambios en la forma, la piel y los tejidos del rostro.",
      "Rhinoplasty and facelift: changes to facial shape, skin and underlying tissues.",
    ),
  };

  return (
    <section
      className="ap-section ap-explorer"
      id="ap-procedimientos"
      aria-labelledby="ap-procedures-title"
    >
      <div className="ap-carousel-heading">
        <h2 id="ap-procedures-title">{t("Procedimientos", "Procedures")}</h2>
        <p className="ap-carousel-summary">{descriptions[category]}</p>
        <div className="ap-carousel-controls">
          <div className="ap-carousel-arrows">
            <button
              type="button"
              aria-label={t("Procedimiento anterior", "Previous procedure")}
              aria-controls="ap-procedure-list"
              disabled={position === 0}
              onClick={() => goTo(position - 1)}
            >
              <Icon name="arrow" />
            </button>
            <button
              type="button"
              aria-label={t("Procedimiento siguiente", "Next procedure")}
              aria-controls="ap-procedure-list"
              disabled={position === lastPosition}
              onClick={() => goTo(position + 1)}
            >
              <Icon name="arrow" />
            </button>
          </div>
          <div
            className="ap-carousel-dots"
            role="group"
            aria-label={t("Posición del carrusel", "Carousel position")}
          >
            {Array.from({ length: lastPosition + 1 }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={t(
                  `Ir al grupo ${index + 1}`,
                  `Go to group ${index + 1}`,
                )}
                aria-current={position === index ? "true" : undefined}
                aria-controls="ap-procedure-list"
                onClick={() => goTo(index)}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
        <div
          className="ap-carousel-categories"
          role="group"
          aria-label={t("Categoría de procedimientos", "Procedure category")}
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              aria-controls="ap-procedure-list"
              onClick={() => changeCategory(item)}
            >
              {categoryLabels[item][language]}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={track}
        className="ap-carousel-track"
        id="ap-procedure-list"
        role="group"
        aria-roledescription={t("carrusel", "carousel")}
        aria-label={t("Carrusel de procedimientos", "Procedure carousel")}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onScroll={synchronizeScroll}
        onScrollEnd={() => {
          const element = track.current;
          // Ignore completion from a previous animation that was superseded.
          if (
            element &&
            pendingOffset.current !== null &&
            Math.abs(element.scrollLeft - pendingOffset.current) > 16
          )
            return;
          pendingOffset.current = null;
          synchronizeScroll();
        }}
        onPointerDown={() => {
          pendingOffset.current = null;
        }}
        onWheel={() => {
          pendingOffset.current = null;
        }}
      >
        {items.map((item, index) => (
          <article
            key={item.slug}
            className={`ap-procedure-card ${index === 0 ? "ap-procedure-card--portrait" : ""} ap-procedure-card--${category}`}
          >
            <Link to={`/procedimientos/${item.slug}`}>
              <div className="ap-procedure-card__image">
                <img
                  src={item.image}
                  alt=""
                  width="340"
                  height="460"
                  loading="lazy"
                />
                <span className="ap-procedure-card__arrow">
                  <Icon name="arrow" />
                </span>
              </div>
              <h3>{item.name[language]}</h3>
              <p>{item.description[language]}</p>
            </Link>
          </article>
        ))}
      </div>
      <div className="ap-carousel-footer">
        <p className="ap-carousel-status" aria-live="polite" aria-atomic="true">
          {t(
            `Grupo ${position + 1} de ${lastPosition + 1}`,
            `Group ${position + 1} of ${lastPosition + 1}`,
          )}
        </p>
        <Link className="ap-text-link" to="/procedimientos">
          {t("Todos los procedimientos", "All procedures")}
          <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
