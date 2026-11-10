import { useEffect, useRef, useState } from "react";
import { LocalizedLink as Link } from "../lib/LocalizedRouting";
import { canChangeCombo, changeCombo, comboImage, comboNames, comboOptions, type ComboId, type ComboView } from "../data/combo";
import { useLanguage } from "../lib/language";
import { Icon } from "./Icon";
import "./combo.css";

function CameraImage({ src }: { src: string }) {
  return <img className="ap-combo__image" src={src} alt="" width="1165" height="2560" draggable="false" />;
}

export function ComboExplorer() {
  const { t, language } = useLanguage();
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState("");
  const [selected, setSelected] = useState<ComboId[]>([]);
  const [view, setView] = useState<ComboView>("front");
  const [compare, setCompare] = useState(false);
  const [split, setSplit] = useState(50);
  const source = comboImage(selected, view);
  const ready = loaded === source && !failed;
  const names = comboNames(selected, language);
  const viewName = view === "front" ? t("Frente", "Front") : t("Espalda", "Back");
  const consultation = `/consulta?${new URLSearchParams({ combo: selected.join(",") })}`;
  const comparing = compare && !!selected.length;

  useEffect(() => {
    if (!section.current) return;
    if (typeof IntersectionObserver === "undefined") { setActive(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setActive(true);
        observer.disconnect();
      }
    }, { rootMargin: "400px" });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setFailed(false);
    const images = [...new Set([comboImage([], view), source])].map(src => {
      const image = new Image();
      const promise = new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = reject;
        image.src = src;
      });
      return { image, promise };
    });
    Promise.all(images.map(item => item.promise)).then(() => {
      if (!cancelled) setLoaded(source);
    }, () => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true;
      images.forEach(({ image }) => { image.onload = null; image.onerror = null; });
    };
  }, [active, source, view, attempt]);

  function reset() {
    setSelected([]);
    setCompare(false);
    setSplit(50);
  }

  function choose(id: ComboId) {
    if (!canChangeCombo(selected, id)) return;
    const next = changeCombo(selected, id);
    setSelected(next);
    setSplit(50);
    if (!next.length) setCompare(false);
  }

  return <section ref={section} className="ap-section ap-combo" id="ap-combo" aria-labelledby="ap-combo-title">
    <div className="ap-combo__heading">
      <h2 id="ap-combo-title">{t("Prueba tu", "Try your")} <em>combo</em></h2>
      <p>{t("Elige hasta tres procedimientos y compara tu combo con la base.", "Choose up to three procedures and compare your combo with the base.")}</p>
    </div>

    <div className="ap-combo__visual">
      <div className="ap-combo__scene" data-ready={ready} data-comparing={comparing}>
        <div className="ap-combo__body" role="img" aria-busy={!ready && !failed}
          aria-label={`${viewName}: ${names || t("cuerpo base", "base body")}`}>
          {active && ready && <>
            <CameraImage src={loaded} />
            {comparing && <div className="ap-combo__base" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
              <CameraImage src={comboImage([], view)} />
            </div>}
          </>}
        </div>
        {failed ? <div className="ap-combo__fallback"><button className="ap-button" type="button"
          onClick={() => { setFailed(false); setAttempt(current => current + 1); }}>
          {t("Volver a cargar la vista", "Reload the view")}<span><Icon name="arrow" /></span>
        </button></div> : comparing && ready ? <>
          <div className="ap-combo__compare-labels" aria-hidden="true"><span>{t("Base", "Base")}</span><span>{t("Tu combo", "Your combo")}</span></div>
          <div className="ap-combo__divider" style={{ left: `${split}%` }} aria-hidden="true"><span><Icon name="arrow" /></span></div>
          <input className="ap-combo__range" type="range" min="5" max="95" value={split}
            aria-label={t("Comparar base y combo", "Compare base and combo")}
            onChange={event => setSplit(Number(event.target.value))} />
        </> : null}
        {!ready && !failed && <span className="ap-combo__loading" role="status">{t("Cargando vista…", "Loading view…")}</span>}
        <button className="ap-combo__compare" type="button" aria-pressed={comparing}
          disabled={!selected.length || !ready || failed} onClick={() => setCompare(current => !current)}>{t("Comparar", "Compare")}</button>
      </div>
      <div className="ap-combo__views" role="group" aria-label={t("Vista del cuerpo", "Body view")}>
        {(["front", "back"] as const).map(camera => <button type="button" key={camera} aria-pressed={view === camera}
          onClick={() => { setView(camera); setSplit(50); }}>{camera === "front" ? t("Frente", "Front") : t("Espalda", "Back")}</button>)}
      </div>
    </div>

    <div className="ap-combo__controls">
      <div className="ap-combo__selection">
        <output aria-live="polite" aria-atomic="true" aria-label={t("Procedimientos seleccionados", "Selected procedures")}>{selected.length} / 3</output>
        <button type="button" onClick={reset} disabled={!selected.length}>{t("Reiniciar", "Reset")}</button>
      </div>
      {(["body", "breast"] as const).map(group => <fieldset className="ap-combo__group" key={group}>
        <legend>{group === "body" ? t("Cuerpo", "Body") : t("Pecho", "Breast")}
          {group === "breast" && <span>{t("Elige una opción", "Choose one option")}</span>}
        </legend>
        {comboOptions.filter(item => item.group === group).map(item => {
          const pressed = selected.includes(item.id);
          const disabled = !canChangeCombo(selected, item.id);
          return <button type="button" key={item.id} aria-pressed={pressed} disabled={disabled}
            className="ap-combo__option" onClick={() => choose(item.id)}>
            {item.name[language]}<span><Icon name={pressed ? "check" : "plus"} /></span>
          </button>;
        })}
      </fieldset>)}
      <div className="ap-combo__action">
        {selected.length ? <Link className="ap-button" to={consultation}>
          {t("Consultar mi combo", "Discuss my combo")}<span><Icon name="arrow" /></span>
        </Link> : <button className="ap-button" type="button" disabled>
          {t("Consultar mi combo", "Discuss my combo")}<span><Icon name="arrow" /></span>
        </button>}
        {names && <p>{names}</p>}
      </div>
    </div>
  </section>;
}
