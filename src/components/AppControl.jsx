import Figure from './Figure.jsx';
import Kicker from './Kicker.jsx';
import { media } from '../data/media.js';

const points = [
  'Werte live einsehen, statt im Zelt zu stehen',
  'Programme anpassen, ohne Kabel und Menütasten',
  'Für Einsteiger wie für erfahrene Indoor-Grower',
];

export default function AppControl() {
  return (
    <section id="app" className="ag-section" data-screen-label="App">
      <div className="ag-wrap ag-two ag-two-app">
        <div className="ag-phone" data-reveal="0">
          <div className="ag-phone-glow" aria-hidden="true" />
          <div className="ag-phone-screen">
            <Figure src={media.appScreen} alt="Green Grower App" ratio="9 / 18.5" radius="26px" hint="App-Screenshot" lighten={false} />
          </div>
        </div>

        <div data-reveal="80">
          <Kicker>Smarte Steuerung</Kicker>
          <h2 className="ag-h2">Dein Growraum,<br />in der Hosentasche</h2>
          <p className="ag-body">
            Der Klimakontroller wird gemeinsam mit einer modernen App entwickelt: Einstellungen bequem
            vornehmen, wichtige Informationen jederzeit einsehen — zu Hause oder unterwegs.
          </p>
          <ul className="ag-points">
            {points.map((p) => (
              <li key={p}><span className="ag-point-rule" />{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
