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
            <a data-glossary="natural-frequency" class="glossary-link">Eigenfrequenz</a>)
            und $2\\gamma := b/m$ ($\\gamma > 0$:
            <a data-glossary="damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>).
            Der Faktor 2 in $2\\gamma$ erweist sich in der Lösung als rechnerisch günstig.<br><br>

            Diese Gleichung nennt man <strong>gedämpft</strong>, weil die Reibungskraft proportional zur
            Geschwindigkeit ist, und <strong>frei</strong>, weil keine äußere Anregung wirkt (
			<a data-glossary="hom-dgl" class="glossary-link">homogene Differentialgleichung</a>
			).<br><br>

            Zur Lösung verwendet man den
            <a data-glossary="exponential-ansatz" class="glossary-link">Exponentialansatz</a>
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
			<a data-glossary="natural-frequency" class="glossary-link">Eigenfrequenz</a>
			$\\omega_e := \\sqrt{\\omega_0^2 - \\gamma^2}$ lautet die
            allgemeine Lösung im Schwingfall ($0<\\gamma<\\omega_0$):
            $$x(t) = e^{-\\gamma t}\\!\\left(c_1\\,e^{-i\\omega_e t} + c_2\\,e^{i\\omega_e t}\\right)$$
            Für eine reelle Auslenkung gilt $c_2=c_1^*$. Der Radikand in der Bestimmungsgleichung bestimmt, welcher der drei Dämpfungsfälle vorliegt:
            <ul>
                <li><strong>Schwingfall</strong> ($\\gamma < \\omega_0$): $\\lambda$ komplex, System schwingt periodisch mit abnehmender Amplitude</li>
                <li><strong>Kriechfall</strong> ($\\gamma > \\omega_0$): $\\lambda$ reell, System kehrt ohne wiederholtes Schwingen zur Ruhe zurück</li>
                <li><strong>Aperiodischer Grenzfall</strong> ($\\gamma = \\omega_0$): doppelte Nullstelle; bei Start aus der Ruhe schnellste Rückkehr ohne Nachschwingen</li>
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
            $$x(t)=A e^{-\\gamma t}\\left(\\cos(\\omega_e t)+\\frac{\\gamma}{\\omega_e}\\sin(\\omega_e t)\\right)$$
        `;

export const t3Text2c = `
            Der Faktor $e^{-\\gamma t}$ beschreibt die exponentiell abklingende Einhüllende; die Sinus-/Cosinuskombination beschreibt
            den periodischen Schwingungsanteil mit der <em>gedämpften</em> Eigenfrequenz $\\omega_e < \\omega_0$.<br><br>

            <strong>Phasenraumdarstellung:</strong> Im Phasenraum $(x,\\, \\dot{x}/\\omega_0)$ ergibt sich eine
            einwärts spiralende Kurve. Der Nullpunkt ist ein <em>stabiler Attraktor</em>, da die
            Energie stetig abnimmt.<br><br>

            <strong>Logarithmisches Dekrement:</strong> Das Verhältnis zweier aufeinanderfolgender Maxima
            (zeitlicher Abstand = Periodendauer $T = 2\\pi/\\omega_e$) beträgt:
            $$\\frac{a_n}{a_{n+1}} = e^{\\gamma T}$$ Dabei sind $a_n,a_{n+1}>0$ die Beträge aufeinanderfolgender positiver Maxima, keine beliebigen Auslenkungen an Nulldurchgängen.
            Daraus definiert man das <strong>logarithmische Dekrement</strong>:
        `;

export const t3Text2d = `
            $$\\Lambda = \\ln\\frac{a_n}{a_{n+1}} = \\gamma T = \\frac{2\\pi\\gamma}{\\sqrt{\\omega_0^2 - \\gamma^2}}$$
        `;

export const t3Text2spoiler = `
            Schreiben wir die allgemeine Schwingfalllösung als $x(t)=C e^{-\\gamma t}\\cos(\\omega_e t+\\phi)$, wiederholt sich ihr Schwingungsanteil nach $T=2\\pi/\\omega_e$. Für aufeinanderfolgende positive Maxima bei $t_n$ und $t_n+T$ gilt daher:
            $$\\frac{a_n}{a_{n+1}}=\\frac{C e^{-\\gamma t_n}\\cos(\\omega_e t_n+\\phi)}{C e^{-\\gamma(t_n+T)}\\cos(\\omega_e t_n+\\phi)}=e^{\\gamma T}.$$
            Die Maxima sind von null verschieden, sodass die Kürzung zulässig ist. Somit folgt $\\Lambda=\\ln(a_n/a_{n+1})=\\gamma T$.
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
        `;

export const t3Text3c = `
            Für große $t$ dominiert bei nicht verschwindendem Koeffizienten der langsamere Term $e^{(-\\gamma+\\alpha)t}$. Wegen $\\alpha<\\gamma$ klingt auch er ab. Für die
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
            Für $x(0)=A$, $\\dot{x}(0)=0$ ergibt sich $x(t)=A(1+\\gamma t)e^{-\\gamma t}$; für $x(0)=0$, $\\dot{x}(0)=v_0$ folgt $x(t)=v_0t e^{-\\gamma t}$. Nur die zweite dieser Lösungen hat für $v_0>0$ ihr Maximum bei $t=1/\\gamma$.
            <br><br>Im vereinfachten linearen Modell ist der Grenzfall der Übergang zwischen Schwingfall und Kriechfall. Bei gleichem $\\omega_0$ und gleicher Anfangsauslenkung mit Start aus der Ruhe kehrt er schneller zurück als der Kriechfall, ohne nachzuschwingen. Das unterstützt das technische Modellziel einer schnellen Beruhigung; reale Geräte und Bauwerke erfordern weitere Auslegungskriterien.
        `;

export const t3Text5a = `
            Die drei Dämpfungsfälle lassen sich anhand des Verhältnisses $\\gamma/\\omega_0$ klassifizieren:
            <ul>
                <li><strong>Schwingfall</strong> ($\\gamma < \\omega_0$): periodische Schwingung mit exponentiell abnehmender Amplitude</li>
                <li><strong>Kriechfall</strong> ($\\gamma > \\omega_0$): bei gleicher Anfangsauslenkung und Start aus der Ruhe langsamer als der Grenzfall</li>
                <li><strong>Aperiodischer Grenzfall</strong> ($\\gamma = \\omega_0$): bei Start aus der Ruhe schnellste Rückkehr ohne Nachschwingen</li>
            </ul>
            Im Schwingfall sind viele Schwingungen zu beobachten, Kriechfall und aperiodischer
            Grenzfall klingen ohne wiederholtes Schwingen ab; ein einzelnes Extremum oder ein Vorzeichenwechsel kann von den Anfangsbedingungen abhängen.
        `;

export const t3Text5b = `
        Hohe Gebäude werden bei Wind oder Erdbeben zu Schwingungen angeregt.
        Ein gutes Schwingungsverhalten sollte dafür sorgen, dass Personen möglichst wenig
        von länger anhaltenden Schwingungen belastet werden und die Konstruktion nicht
        unnötig vielen Lastwechseln ausgesetzt wird.
    `;
