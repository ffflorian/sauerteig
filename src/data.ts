export interface StepData {
  additionalInfo?: string[];
  ingredients: string[];
  /** the time in minutes to work on the current step */
  manualTime: number;
  /** the time in minutes to finish the current step */
  otherTime: number;
  steps: string[];
  subtitle?: string;
  title: string;
}

export type IntroductionProps = Pick<StepData, 'ingredients' | 'title'>;

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
    ingredients: ['400 ml lauwarmes Wasser', '250 g Roggenvollkornmehl', 'Frischhaltefolie', 'mittelgroße Schüssel'],
    manualTime: 15,
    otherTime: 5760,
    steps: [
      '200 ml Wasser mit 160 g Mehl in der Schüssel vermengen',
      'Schüssel mit Frischhaltefolie abdecken und 48 Std. bei Zimmertemperatur ruhen lassen',
      '100 ml Wasser und 45 g Mehl dazu mischen',
      'Abdecken und 24 Std. ruhen lassen',
      '100 ml Wasser und 45 g Mehl dazu mischen',
      'Abdecken und weitere 24 Std. ruhen lassen',
    ],
    title: 'Grundrezept (Anstellsauer)',
  },
  {
    additionalInfo: [
      'Dies im Abstand von 6-8 Std. 3x wiederholen und dazwischen mit einem Küchenhandtuch abgedeckt an einem warmen Ort ruhen lassen.',
      'Dieser Schritt kann auch mehr als 3x wiederholt werden, wenn das Brot später als geplant gebacken werden soll.',
    ],
    ingredients: ['2 EL lauwarmes Wasser', '1 EL Roggen(vollkorn)mehl', '1 große Schüssel'],
    manualTime: 20,
    otherTime: 1320,
    steps: ['Anstellsauer in die Schüssel umfüllen', 'Wasser und Mehl hinzufügen und verrühren'],
    subtitle: '(hier starten, wenn Anstellsauer schon vorhanden ist)',
    title: 'Füttern',
  },
  {
    ingredients: ['350 g Roggen(vollkorn)mehl', '500 ml warmes Wasser'],
    manualTime: 5,
    otherTime: 720,
    steps: [
      'Wasser und Mehl mit dem Teig verrühren',
      '12 Stunden mit einem Küchenhandtuch abgedeckt an einem warmen Ort ruhen lassen',
    ],
    title: 'Bereit machen zum backen',
  },
  {
    additionalInfo: ['Wichtig: alle 1-2 Tage füttern, sonst verhungert der Anstellsauer.'],
    ingredients: [
      'ein luftdicht verschließbares Gefäß (z.B. ein gut gespültes Gurkenglas), das nicht zu klein ist, denn der Anstellsauer wächst',
      '2 EL kaltes Wasser',
      '1 EL Roggen(vollkorn)mehl',
    ],
    manualTime: 5,
    otherTime: 0,
    steps: [
      '50-100 ml Anstellsauer abnehmen und in das Gefäß füllen',
      'Das Wasser und Roggenmehl hinzufügen, vermischen und das Gefäß luftdicht verschließen',
      'Das Gefäß mit Anstellsauer in den Kühlschrank stellen',
    ],
    title: 'Neuer Anstellsauer',
  },
  {
    ingredients: [
      '250 ml warmes Wasser',
      '500 g Dinkelmehl (anderes Mehl geht auch, aber Dinkelmehl macht das Brot saftig)',
      '15 g Salz',
      'ggf. Sonnenblumenkerne oder andere Zutaten, die eingebacken werden sollen',
    ],
    manualTime: 15,
    otherTime: 150,
    steps: [
      'Das Mehl, Wasser und Salz zum restlichen Anstellsauer hinzufügen',
      'Ggf. die Kerne hinzufügen',
      '12 Min. verkneten (am besten mit einem Holzlöffel oder einer Kitchen Aid)',
      'Mit einem Küchenhandtuch abdecken 30 Min. gehen lassen',
      'Brotform mit Backpapier auslegen',
      'Nicht abdecken (sonst wächst der Teig über die Form hinaus) und 2 Std. gehen lassen',
    ],
    title: 'Teigherstellung',
  },
  {
    ingredients: [],
    manualTime: 5,
    otherTime: 55,
    steps: [
      'Backofen auf 200 °C Ober- und Unterhitze vorheizen',
      'Ggf. Brot mit einem nassen Messer in der Mitte einschneiden',
      'Bei 200 °C Ober- und Unterhitze 15 Min. backen (untere Schiene)',
      'Bei 220 °C Ober- und Unterhitze 40 Min. backen (untere Schiene)',
      'Nach dem Backen sofort aus der Form nehmen, das Backpapier abziehen und das Brot abkühlen lassen  ',
    ],
    title: 'Backen',
  },
];
