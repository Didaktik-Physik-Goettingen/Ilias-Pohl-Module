export const t3Text1a = `
            Die Differentialgleichung (DGL) des <strong>gedämpften, freien harmonischen Oszillators</strong>
            ergibt sich aus der Bilanzierung aller Kräfte: Rückstellkraft $F_D = -Dx$, Reibungskraft
            $F_R = -b\\dot{x}$ und keine äußere Anregung. In der Normalform lautet die Gleichung:
        `;

export const t3Text1b = `
            $$\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = 0$$
        `;

export const t3Text1c = `
            mit den Abkürzungen $\\omega_0^2 := D/m$ (ungedämpfte
            <a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a>)
            und $2\\gamma := b/m$ ($\\gamma > 0$:
            <a href="#glossary-damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>).
            Der Faktor 2 in $2\\gamma$ erweist sich in der Lösung als rechnerisch günstig.<br><br>

            Diese Gleichung nennt man <strong>gedämpft</strong>, weil die Reibungskraft proportional zur
            Geschwindigkeit ist, und <strong>frei</strong>, weil keine äußere Anregung wirkt (
			<a href="#glossary-hom-dgl" class="glossary-link">homogene Differentialgleichung</a>
			).<br><br>

            Zur Lösung verwendet man den
            <a href="#glossary-exponential-ansatz" class="glossary-link">Exponentialansatz</a>
            $x(t) = c\\,e^{\\lambda t}$ ($c \\neq 0$). Da $e^{\\lambda t}$ beim Ableiten nur mit konstanten
            Faktoren multipliziert wird, lassen sich alle Terme nach dem Einsetzen durch $e^{\\lambda t}$
            kürzen. Man erhält die <strong>Bestimmungsgleichung</strong>:
            $$\\lambda^2 + 2\\gamma\\lambda + \\omega_0^2 = 0$$
            Ihre Lösungen folgen aus der pq-Formel:
        `;

export const t3Text1d = `
            $$\\lambda_{1,2} = -\\gamma \\pm \\sqrt{\\gamma^2 - \\omega_0^2}$$
        `;

export const t3Text1e = `
            Mit der gedämpften
			<a href="#glossary-natural-frequency" class="glossary-link">Eigenfrequenz</a>
			$\\omega_e := \\sqrt{\\omega_0^2 - \\gamma^2}$ lautet die
            allgemeine Lösung:
            $$x(t) = e^{-\\gamma t}\\!\\left(c_1\\,e^{-i\\omega_e t} + c_2\\,e^{i\\omega_e t}\\right)$$
            Der Ausdruck unter der Wurzel bestimmt, welcher der drei Dämpfungsfälle vorliegt:
            <ul>
                <li><strong>Schwingfall</strong> ($\\gamma < \\omega_0$): $\\lambda$ komplex, System schwingt periodisch mit abnehmender Amplitude</li>
                <li><strong>Kriechfall</strong> ($\\gamma > \\omega_0$): $\\lambda$ reell, System kriecht monoton zur Ruhe</li>
                <li><strong>Aperiodischer Grenzfall</strong> ($\\gamma = \\omega_0$): entartete Lösung, schnellste Rückkehr ohne Schwingen</li>
            </ul>
        `;

export const t3Text1spoiler = `
            Wir verwenden den Ansatz $x(t) = c\\,e^{\\lambda t}$ ($c \\neq 0$). Die Ableitungen sind:
            $$\\dot{x}(t) = c\\lambda\\,e^{\\lambda t}, \\qquad \\ddot{x}(t) = c\\lambda^2\\,e^{\\lambda t}$$
            Einsetzen in $\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = 0$ und Ausklammern von $c\\,e^{\\lambda t} \\neq 0$:
            $$\\lambda^2 + 2\\gamma\\lambda + \\omega_0^2 = 0$$
        `;

export const t3Text2a = `
            Im <strong>Schwingfall</strong> ($\\gamma < \\omega_0$) sind die Lösungen der Bestimmungsgleichung komplex:
            $$\\lambda_{1,2} = -\\gamma \\pm i\\omega_e, \\qquad \\omega_e = \\sqrt{\\omega_0^2 - \\gamma^2}$$
            Die allgemeine Lösung ist eine gedämpfte Schwingung. Für die gebräuchlichsten Anfangsbedingungen
            $x(0) = A$, $\\dot{x}(0) = 0$ vereinfacht sie sich zu:
        `;

export const t3Text2b = `
            $$x(t) = A\\,e^{-\\gamma t}\\cos(\\omega_e t)$$
        `;

export const t3Text2c = `
            Der Faktor $e^{-\\gamma t}$ beschreibt den exponentiellen Amplitudenabfall, $\\cos(\\omega_e t)$
            den periodischen Schwingungsanteil mit der <em>gedämpften</em> Eigenfrequenz $\\omega_e < \\omega_0$.<br><br>

            <strong>Phasenraumdarstellung:</strong> Im Phasenraum $(x,\\, \\dot{x}/\\omega_0)$ ergibt sich eine
            einwärts spiralende Kurve. Der Nullpunkt ist ein <em>stabiler Attraktor</em>, da die
            Energie stetig abnimmt.<br><br>

            <strong>Logarithmisches Dekrement:</strong> Das Verhältnis zweier aufeinanderfolgender Maxima
            (zeitlicher Abstand = Periodendauer $T = 2\\pi/\\omega_e$) beträgt:
            $$\\frac{x(t)}{x(t+T)} = e^{\\gamma T}$$
            Daraus definiert man das <strong>logarithmische Dekrement</strong>:
        `;

export const t3Text2d = `
            $$\\Lambda = \\ln\\frac{x(t)}{x(t+T)} = \\gamma T = \\frac{2\\pi\\gamma}{\\sqrt{\\omega_0^2 - \\gamma^2}}$$
        `;

export const t3Text2spoiler = `
            Einsetzen der Lösung $x(t) = A\\,e^{-\\gamma t}\\cos(\\omega_e t)$ in den Logarithmus:
            $$\\Lambda = \\ln\\frac{A\\,e^{-\\gamma t}\\cos(\\omega_e t)}{A\\,e^{-\\gamma(t+T)}\\cos(\\omega_e(t+T))}$$
            Da $\\cos(\\omega_e(t+T)) = \\cos(\\omega_e t + 2\\pi) = \\cos(\\omega_e t)$ (Periodizität), kürzen
            sich die Cosinus-Terme heraus. Mit $e^{-\\gamma t}/e^{-\\gamma(t+T)} = e^{\\gamma T}$ folgt:
            $$\\Lambda = \\ln(e^{\\gamma T}) = \\gamma T$$
        `;

export const t3Text3a = `
            Im <strong>Kriechfall</strong> ($\\gamma > \\omega_0$) sind beide Lösungen der
            Bestimmungsgleichung reell und negativ:
            $$\\lambda_{1,2} = -\\gamma \\pm \\alpha, \\qquad \\alpha = \\sqrt{\\gamma^2 - \\omega_0^2} \\in \\mathbb{R},\\quad \\alpha < \\gamma$$
            Da $\\alpha < \\gamma$, sind beide Exponenten $\\lambda_{1,2}$ negativ: das System kehrt ohne
            Schwingungen langsam zur Ruhe zurück. Die allgemeine Lösung lautet:
        `;

export const t3Text3b = `
            $$x(t) = e^{-\\gamma t}\\!\\left(c_1\\,e^{\\alpha t} + c_2\\,e^{-\\alpha t}\\right)$$
            Der Term $e^{-\\gamma t}$ dominiert für große $t$, da $\\alpha < \\gamma$ gilt. Für die
            Anfangsbedingungen $x(0) = 0$, $\\dot{x}(0) = v_0$ ergibt sich die Speziallösung:
            $$x(t) = \\frac{v_0}{\\alpha}\\,e^{-\\gamma t}\\sinh(\\alpha t)$$
            Für $x(0) = A$, $\\dot{x}(0) = 0$:
            $$x(t) = \\frac{A}{\\alpha}\\,e^{-\\gamma t}\\!\\left(\\alpha\\cosh(\\alpha t) + \\gamma\\sinh(\\alpha t)\\right)$$
            Im Vergleich zum aperiodischen Grenzfall fällt der Kriechfall <em>langsamer</em> ab, da
            die stärkere Dämpfung das System träger macht.
        `;

export const t3Text4a = `
            Im <strong>aperiodischen Grenzfall</strong> gilt $\\gamma = \\omega_0$. Die Bestimmungsgleichung
            hat dann eine doppelte Nullstelle:
            $$\\lambda_1 = \\lambda_2 = \\lambda = -\\gamma$$
            Da die allgemeine Lösung zwei freie Integrationskonstanten benötigt, reicht der einfache
            Exponentialansatz nicht aus. Man erweitert ihn durch einen linearen Vorfaktor:
        `;

export const t3Text4b = `
            $$x(t) = (c_1 t + c_2)\\,e^{-\\gamma t}$$
        `;

export const t3Text4c = `
            Für $x(0) = A$, $\\dot{x}(0) = 0$ ergibt sich $x(t) = A(1 + \\gamma t)\\,e^{-\\gamma t}$;
            für $x(0) = 0$, $\\dot{x}(0) = v_0$ folgt $x(t) = v_0 t\\,e^{-\\gamma t}$.<br><br>

            Der aperiodische Grenzfall kehrt <em>schneller zur Ruhe zurück als der Kriechfall</em> — er
            ist der Übergang zwischen Schwingfall und Kriechfall. Das Maximum bei $t_\\text{max} = 1/\\gamma$
            ist das einzige und es wird kein weiteres Vorzeichenwechsel beobachtet.<br><br>

            Dieses Verhalten ist technisch besonders interessant: Messgerätezeiger und Gebäudedämpfer
            werden oft nahe am aperiodischen Grenzfall ausgelegt, um schnell zur Ruhe zu kommen ohne
            nachzuschwingen.
        `;

export const t3Text5a = `
            Die drei Dämpfungsfälle lassen sich anhand des Verhältnisses $\\gamma/\\omega_0$ klassifizieren:
            <ul>
                <li><strong>Schwingfall</strong> ($\\gamma < \\omega_0$): periodische Schwingung mit exponentiell abnehmender Amplitude</li>
                <li><strong>Kriechfall</strong> ($\\gamma > \\omega_0$): monotones Abklingen, langsamer als der Grenzfall</li>
                <li><strong>Aperiodischer Grenzfall</strong> ($\\gamma = \\omega_0$): schnellste Rückkehr zur Ruhe ohne Schwingen</li>
            </ul>
            Im Schwingfall sind viele Schwingungen zu beobachten, Kriechfall und aperiodischer
            Grenzfall zeigen eine einzelne monotone Auslenkung, die gegen Null geht.
        `;

export const t3Text5b = `
        Hohe Gebäude werden bei Wind oder Erdbeben zu Schwingungen angeregt.
        Ein gutes Schwingungsverhalten sollte dafür sorgen, dass Personen möglichst wenig
        von länger anhaltenden Schwingungen belastet werden und die Konstruktion nicht
        unnötig vielen Lastwechseln ausgesetzt wird.
    `;
