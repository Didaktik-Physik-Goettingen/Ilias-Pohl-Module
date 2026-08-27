export const chaosText1a = `
    Die Grundlage für harmonische Schwingungen ist, dass die rücktreibende Kraft linear mit der Auslenkung aus der Gleichgewichtsposition.
    Bei einer solchen Kraft ist das zugrundeliegende Potential parabolisch.
`;

export const chaosText1b = `
          Wenn man allerdings eine zusätzliche Masse an das Schwungrad anbringt, bewirkt diese ein zusätzliches cosinus-förmiges Potential
          ($V\_{\\text{Zusatzmasse}}(\\phi) = mgR\\cos(\\phi)$).
          Aus der Überlagerung des quadratischen und des cosinus-förmingen Potentials resultiert, wie die obere Abbildung zeigt,
          ein Potential mit zwei lokalen Minima im relevanten Winkelbereich. Ein solches Potential wird häufig als "W-Potential" bezeichnet.<br>
          Eine zusätzliche Masse bewirkt somit, dass es keinen stabilen Gleichgewichtspunkt des Rades mehr in der Ausgangsposition gibt,
          sondern $\\phi=0$ zu einem labilen Gleichgewichtspunkt wird, an dem kleine Änderungen des Auslenkwinkels die Dynamik entscheidend bestimmen.
          Stattdessen entstehen zwei neue, symmetrisch um den Ursprung verteilte Gleichgewichtslagen.
      `;

export const chaosText1c = `
    Die Bewegungsdynamik des Pendels hängt nun noch stärker von der <a data-glossary="amplitude" class="glossary-link">Amplitude</a> der Schwingung und der Dämpfung ab.   <br>
    Zwei Aspekte können wir bereits aus dem Potential ableiten:<br>
    Für kleine Auslenkungen aus einer der neuen Gleichgewichtslagen ist das Potential noch immer näherungsweise parabolisch
    und die Schwingung ist harmonisch (s. untere Abbildung).
    Für größere Auslenkungen aus der Gleichgewichtslage erfährt das Schwungrad aber eine unsymmetrische Rückstellkraft.<br><br>
    Welchen Einfluss hat die Dämpfung auf das System? Was geschieht bei einer starken Dämpfung?
    Warum verändert sich das Verhalten, wenn die Dämpfung verringert wird?
`;

export const chaosText2a = `
    Aufgrund des durch die Masse bewirkten Drehmoments lautet die gesamte Bewegungsgleichung für das gedämpfte, harmonisch getriebene System:
`;

export const chaosText2b = `
          $$\\ddot{\\varphi} + 2\\tilde{\\beta} \\dot{\\varphi} + \\tilde{\\omega}_0^2\\phi + \\alpha\\sin{\\phi} = N\\cos{\\omega t} $$
        `;

export const chaosText2c = `
          Beachte, dass durch Tilden über den Variablen angezeigt werden soll, dass sich das aufgrund der Zusatzmassen das
          <a data-glossary="moment-of-inertia" class="glossary-link">Trägheitsmoment</a> geändert hat.
          Zudem haben wir die Variable $\\alpha = \\frac{mgr}{\\Theta_1}$ mit dem neuen <a data-glossary="moment-of-inertia" class="glossary-link">Trägheitsmoment</a><br>
          Für sehr kleine Nichtlinearitäten, können wir bei kleinen Auslenkungen die Sinusfunktion in erster Näherung betrachten:
          $\\sin(\\phi) \\approx \\phi$, wodurch sich wieder eine lineare Schwingungsgleichung ergibt:
          $$\\ddot{\\varphi} + 2\\tilde{\\beta} \\dot{\\varphi} +( \\tilde{\\omega}_0^2+\\alpha)\\phi = N\\cos{\\omega t} $$<br>
          Diese Gleichung kann wie gewohnt gelöst werden und es zeigt sich, dass die zusätzliche Masse lediglich eine Änderung der
          <a data-glossary="angular-frequency" class="glossary-link">Eigenschwingfrequenz</a> bewirkt.<br>
          Für größere Auslenkungen müssen weitere Terme der Taylorentwicklung berücksichtigt werden, die zu einer Verzerrung (zu höheren Frequenzen) der Resonanzfrequenz-Kurve führen.<br><br>
          Im Versuch werden Sie sich mit Nicht-Linearitäten beschäftigen, die zur Ausbildung neuer Ruhelagen führen. Um das Schwingungsverhalten in diesem Fall für kleine Auslenkungen zu betrachten,
          können wir in ähnlicher Weise vorgehen, wie soeben beschrieben, wobei wir die Entwicklung des Sinus um eine der neuen Gleichgewichtspositionen betrachten, also um
          $\\phi_0 \\neq 0$. Eine solche Rechnung zeigt ebenfalls, dass die zusätzliche Masse zu einer Verschiebung der
          <a data-glossary="resonance-frequency" class="glossary-link">Resonanzfrequenz</a> führt, wobei die Verzerrung hin zu kleineren Frequenzen ist.<br><br>
          Verringert man die Dämpfung in einem System mit ausgeprägten Nichtlinearitäten, tritt zunächst eine sogenannte <b>Bifurkation</b> auf.
          Dabei spaltet sich die ursprünglich einfache Grundamplitude auf. Das Pendel schwingt dann nicht mehr mit nur einer Frequenz,
          sondern zeigt eine <b>Überlagerung aus zwei verschiedenen Frequenzen</b>, also höheren Harmonischen der Grundfrequenz.
          Im Phasenraumdiagramm erkennt man dies daran, dass die Bewegung nicht mehr einer einzigen Ellipse entspricht, sondern als <b>zwei ineinander übergehende Ellipsen</b> erscheint.<br><br>
          Reduziert man die Dämpfung weitere, so kann die Bewegung zunächst noch durch die weitere Überlagerung mit Schwingungen höherer Frequenzen beschrieben werden,
          geht dann aber in ein chaotisches Verhalten über.
          Selbst wenn man die Bewegung über einen längeren Zeitraum hinweg betrachtet, lässt sich keine Periodizität ausmachen.
          Im Phasenraum lässt sich ein solches deterministisches Chaos darin erkennen, dass die Trajektorie nicht wieder in sich selbst übergeht,
          sondern immer weitere Bereiche des Phasenraums überdeckt werden.
        `;

export const chaosText3a = `
    Im Versuch werden Sie die Theorie zu getriebenen und gedämpften Schwingungen am Beispiel eines Pohlschen Resonators untersuchen.
    Um sich einen Überblick über den Versuchsaufbau zu verschaffen,
    vergleichen Sie oben das Foto des Versuchsaufbaus mit der Skizze und versuchen Sie die unterschiedlichen Bauelemente zu identifizieren.
`;
