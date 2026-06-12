export type IntroductionProps = Pick<StepData, 'ingredients' | 'title'>;

export interface StepData {
  additionalInfo?: string[];
  id: string;
  importantInfo?: string;
  ingredients: string[];
  /** the time in minutes to work on the current step */
  manualTime: number;
  /** the time in minutes to finish the current step */
  otherTime: number;
  steps: StepItem[];
  subtitle?: string;
  title: string;
}

export interface StepItem {
  id: string;
  text: string;
  timerMinutes?: number;
}

export const introductionData: IntroductionProps = {
  ingredients: [
    'Frischhaltefolie',
    'Backpapier',
    'Brotbackform',
    'große Schüssel',
    'mittelgroße Schüssel',
    'luftdicht verschließbares Gefäß (z.B. ein gut gespültes Gurkenglas)',
    '15 g Salz',
    '600 g Roggenvollkornmehl',
    '500 g Dinkelmehl (anderes Mehl geht auch, aber Dinkelmehl macht das Brot saftig)',
    'ggf. Sonnenblumenkerne oder andere Zutaten, die eingebacken werden sollen',
    'ggf. Holzlöffel',
  ],
  title: 'Vorbereitung',
};

export const stepsData: StepData[] = [
  {
    id: 'xk7p2',
    ingredients: ['400 ml lauwarmes Wasser', '250 g Roggenvollkornmehl', 'Frischhaltefolie', 'mittelgroße Schüssel'],
    manualTime: 15,
    otherTime: 5760,
    steps: [
      {id: 'a3r7x', text: '200 ml Wasser mit 160 g Mehl in der Schüssel vermengen'},
      {
        id: 'k9m2p',
        text: 'Schüssel mit Frischhaltefolie abdecken und 48 Std. bei Zimmertemperatur ruhen lassen',
        timerMinutes: 2880,
      },
      {id: 'z4v6n', text: '100 ml Wasser und 45 g Mehl dazu mischen'},
      {id: 'y8c1w', text: 'Abdecken und 24 Std. ruhen lassen', timerMinutes: 1440},
      {id: 'h5j3q', text: '100 ml Wasser und 45 g Mehl dazu mischen'},
      {id: 'f7t9s', text: 'Abdecken und weitere 24 Std. ruhen lassen', timerMinutes: 1440},
    ],
    title: 'Grundrezept (Anstellsauer)',
  },
  {
    additionalInfo: [
      'Dies im Abstand von 6-8 Std. 3x wiederholen und dazwischen mit einem Küchenhandtuch abgedeckt an einem warmen Ort ruhen lassen.',
      'Dieser Schritt kann auch mehr als 3x wiederholt werden, wenn das Brot später als geplant gebacken werden soll.',
    ],
    id: 'm4n9r',
    ingredients: ['2 EL lauwarmes Wasser', '1 EL Roggen(vollkorn)mehl', '1 große Schüssel'],
    manualTime: 20,
    otherTime: 1320,
    steps: [
      {id: 'e2u4b', text: 'Anstellsauer in die Schüssel umfüllen'},
      {id: 'i6o8d', text: 'Wasser und Mehl hinzufügen und verrühren'},
    ],
    subtitle: '(hier starten, wenn Anstellsauer schon vorhanden ist)',
    title: 'Füttern',
  },
  {
    id: 'q1t5v',
    ingredients: ['350 g Roggen(vollkorn)mehl', '500 ml warmes Wasser'],
    manualTime: 5,
    otherTime: 720,
    steps: [
      {id: 'r1x5k', text: 'Wasser und Mehl mit dem Teig verrühren'},
      {
        id: 'g9n3m',
        text: '12 Stunden mit einem Küchenhandtuch abgedeckt an einem warmen Ort ruhen lassen',
        timerMinutes: 720,
      },
    ],
    title: 'Bereit machen zum backen',
  },
  {
    id: 'l8w3z',
    importantInfo: 'alle 1-2 Tage füttern, sonst verhungert der Anstellsauer.',
    ingredients: [
      'ein luftdicht verschließbares Gefäß (z.B. ein gut gespültes Gurkenglas), das nicht zu klein ist, denn der Anstellsauer wächst',
      '2 EL kaltes Wasser',
      '1 EL Roggen(vollkorn)mehl',
    ],
    manualTime: 5,
    otherTime: 0,
    steps: [
      {id: 'w7p4z', text: '50-100 ml Anstellsauer abnehmen und in das Gefäß füllen'},
      {id: 'v2c8y', text: 'Das Wasser und Roggenmehl hinzufügen, vermischen und das Gefäß luftdicht verschließen'},
      {id: 's6h1j', text: 'Das Gefäß mit Anstellsauer in den Kühlschrank stellen'},
    ],
    title: 'Neuer Anstellsauer',
  },
  {
    id: 'b6f0j',
    ingredients: [
      '250 ml warmes Wasser',
      '500 g Dinkelmehl (anderes Mehl geht auch, aber Dinkelmehl macht das Brot saftig)',
      '15 g Salz',
      'ggf. Sonnenblumenkerne oder andere Zutaten, die eingebacken werden sollen',
    ],
    manualTime: 15,
    otherTime: 150,
    steps: [
      {id: 'b4f9t', text: 'Das Mehl, Wasser und Salz zum restlichen Anstellsauer hinzufügen'},
      {id: 'u3r7a', text: 'Ggf. die Kerne hinzufügen'},
      {
        id: 'o5q2e',
        text: '12 Min. verkneten (am besten mit einem Holzlöffel oder einer Kitchen Aid)',
        timerMinutes: 12,
      },
      {id: 'n8w6x', text: 'Mit einem Küchenhandtuch abdecken und 30 Min. gehen lassen', timerMinutes: 30},
      {id: 'c1m4k', text: 'Brotform mit Backpapier auslegen'},
      {
        id: 'd7z9p',
        text: 'Nicht abdecken (sonst wächst der Teig über die Form hinaus) und 2 Std. gehen lassen',
        timerMinutes: 120,
      },
    ],
    title: 'Teigherstellung',
  },
  {
    id: 'd2h4s',
    ingredients: [],
    manualTime: 5,
    otherTime: 55,
    steps: [
      {id: 'j5v3b', text: 'Backofen auf 200 °C Ober- und Unterhitze vorheizen'},
      {id: 'l8u1r', text: 'Ggf. Brot mit einem nassen Messer in der Mitte einschneiden'},
      {id: 'q4s7n', text: 'Bei 200 °C Ober- und Unterhitze 15 Min. backen (untere Schiene)', timerMinutes: 15},
      {id: 'h2g6f', text: 'Bei 220 °C Ober- und Unterhitze 40 Min. backen (untere Schiene)', timerMinutes: 40},
      {
        id: 'y9t5c',
        text: 'Nach dem Backen sofort aus der Form nehmen, das Backpapier abziehen und das Brot abkühlen lassen',
      },
    ],
    title: 'Backen',
  },
];
