/**
 * Bildflaeche. Ohne src wird ein Platzhalter mit Hinweistext gezeigt,
 * damit das Layout auch ohne Fotos vollstaendig steht.
 */
export default function Figure({ src, alt = '', ratio = '4 / 3', radius = 'var(--radius-lg)', hint, lighten = true }) {
  if (!src) {
    return (
      <div className="ag-figure ag-figure-empty" style={{ aspectRatio: ratio, borderRadius: radius }}>
        <span>{hint}</span>
      </div>
    );
  }
  return (
    <div className={lighten ? 'ag-figure lighten' : 'ag-figure'} style={{ aspectRatio: ratio, borderRadius: radius }}>
      <img src={src} alt={alt} />
    </div>
  );
}
