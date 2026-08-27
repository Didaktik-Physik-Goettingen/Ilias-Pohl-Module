export const t4Text1a = `
            Wird ein gedämpfter harmonischer Oszillator zusätzlich durch eine periodische äußere Kraft
            angetrieben, spricht man von einem <strong>getriebenen</strong> Oszillator. Die Gesamtkraft
            setzt sich aus Rückstellkraft, Reibungskraft und Antriebskraft zusammen:
            $$m\\ddot{x} = -Dx - b\\dot{x} + F_{\\text{ext}}\\cos(\\omega t)$$
            Mit den Abkürzungen $\\omega_0^2 := D/m$, $2\\gamma := b/m$ und $K := F_{\\text{ext}}/m$
            lautet die <strong>Normalform</strong>:
        `;

export const t4Text1b = `
            $$\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = K\\cos(\\omega t)$$
        `;

export const t4Text1c = `
            Diese
            <a data-glossary="inhom-dgl" class="glossary-link">Differentialgleichung</a>
            nennt man:
            <ul>
                <li><strong>gedämpft</strong>, weil eine zur Geschwindigkeit proportionale Reibungskraft wirkt,</li>
                <li><strong>getrieben</strong>, weil eine äußere, periodische Anregung im System wirkt, und</li>
                <li><strong>harmonisch</strong>, weil Sinus- und Cosinusfunktionen die Schwingungsform beschreiben.</li>
            </ul>
            Sie ist <strong>inhomogen</strong>, da der Anregungsterm $K\\cos(\\omega t)$ nicht von
            der Auslenkung $x$ oder ihrer Ableitung abhängt.
        `;

export const t4Text2a = `
            Beim Pohlschen Rad betrachten wir eine <strong>Rotationsbewegung</strong>. Die DGL ergibt
            sich aus der Bilanz der
            <a data-glossary="angular-momentum" class="glossary-link">Drehmomente</a>
            $\\Theta\\ddot{\\varphi} = \\sum_i M_i$ mit dem
            <a data-glossary="moment-of-inertia" class="glossary-link">Trägheitsmoment</a>
            $\\Theta$:
            <ul>
                <li>Rückstellmoment: $-D^*\\varphi$ mit dem
                    <a data-glossary="directive-moment" class="glossary-link">Richtmoment</a> $D^*$</li>
                <li>Dämpfungsmoment: $-\\rho\\dot{\\varphi}$ mit dem Reibungskoeffizienten $\\rho$</li>
                <li>Antriebsmoment: $M\\cos(\\omega t)$</li>
            </ul>
            Mit den Abkürzungen $2\\beta := \\rho/\\Theta$, $\\omega_0^2 := D^*/\\Theta$ und
            $N := M/\\Theta$ lautet die DGL:
        `;

export const t4Text2b = `
            $$\\ddot{\\varphi} + 2\\beta\\dot{\\varphi} + \\omega_0^2\\varphi = N\\cos(\\omega t)$$
        `;

export const t4Text2c = `
            Diese Gleichung ist formal identisch mit der Normalform des linearen Falls --- lediglich die
            Auslenkung $x$ wird durch den Winkel $\\varphi$ ersetzt und $\\gamma$ durch $\\beta$.<br><br>
            Zur Lösung der
            <a data-glossary="inhom-dgl" class="glossary-link"><strong>inhomogenen</strong> Differentialgleichung</a>
            addiert man die Lösungen des homogenen
            und partikulären Anteils:
            $$\\varphi(t) = \\varphi_h(t) + \\varphi_p(t)$$
        `;

export const t4Text3a = `
            Um die
            <a data-glossary="inhom-dgl" class="glossary-link">inhomogene Differentialgleichung</a>
            zu lösen, nutzt man einen eleganten Trick: Die reelle Inhomogenität
            $N\\cos(\\omega t)$ wird als Realteil einer komplexen Exponentialfunktion geschrieben:
            $$N\\cos(\\omega t) = \\operatorname{Re}\\!\\left[N e^{i\\omega t}\\right]$$
            Gleichzeitig lässt man zu, dass die Lösung $\\varphi$ komplex ist: $\\varphi \\to \\tilde{\\varphi}$.
            Die physikalische (reelle) Lösung erhält man am Ende als Realteil von $\\tilde{\\varphi}$.<br><br>
            Die <strong>komplexe DGL</strong> lautet:
        `;

export const t4Text3b = `
            $$\\ddot{\\tilde{\\varphi}} + 2\\beta\\dot{\\tilde{\\varphi}} + \\omega_0^2\\tilde{\\varphi} = N e^{i\\omega t}$$
        `;

export const t4Text3c = `
            Der Vorteil dieser Methode: Die komplexe Exponentialfunktion $e^{i\\omega t}$ verhält sich
            unter Ableitung besonders einfach ($\\frac{d}{dt}e^{i\\omega t} = i\\omega e^{i\\omega t}$) ---
            es entstehen nur konstante Vorfaktoren, keine Übergänge zwischen Sinus und Cosinus.
            Das vereinfacht das Einsetzen des Ansatzes erheblich.
        `;

export const t4Text4a = `
            Zur Lösung der komplexen
            <a data-glossary="inhom-dgl" class="glossary-link">inhomogenen Differentialgleichung</a>
            wählt man einen Ansatz, dessen Struktur der
            Inhomogenität ähnelt - also eine komplexe Exponentialfunktion mit der <em>gleichen</em>
            Frequenz $\\omega$ wie die Anregung:
        `;

export const t4Text4b = `
            $$\\tilde{\\varphi}_p(t) = A\\,e^{i\\omega t}, \\qquad A \\in \\mathbb{C}$$
        `;

export const t4Text4c = `
            Durch Einsetzen und Auflösen nach der <strong>komplexen Amplitude</strong> $A$ findet man
            deren Betrag und Phase. Die reelle partikuläre Lösung ergibt sich als Realteil:
        `;

export const t4Text4d = `
            $$\\varphi_p(t) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+(2\\beta\\omega)^2}}\\cos(\\omega t - \\Phi)$$
            mit der Phasenverschiebung $\\Phi = \\arctan\\!\\left(\\dfrac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)$.
        `;

export const t4Text4spoiler = `
            Die zeitlichen Ableitungen des Ansatzes $\\tilde{\\varphi}_p = A\\,e^{i\\omega t}$ lauten:
            $$\\dot{\\tilde{\\varphi}}_p = i\\omega A\\,e^{i\\omega t}, \\qquad
              \\ddot{\\tilde{\\varphi}}_p = -\\omega^2 A\\,e^{i\\omega t}$$
            Einsetzen in die komplexe DGL und Ausklammern von $e^{i\\omega t} \\neq 0$:
            $$A\\left(-\\omega^2 + 2i\\beta\\omega + \\omega_0^2\\right) = N$$
            Daraus folgt:
            $$A = \\frac{N}{\\omega_0^2 - \\omega^2 + 2i\\beta\\omega}$$
            Mit $|A| = \\dfrac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+(2\\beta\\omega)^2}}$ und
            $\\arg(A) = -\\Phi$ ergibt sich die reelle partikuläre Lösung als $\\operatorname{Re}[A\\,e^{i\\omega t}]$.
        `;

export const t4Text5a = `
            Die homogene Lösung $\\varphi_h(t)$ --- die Lösung <em>ohne</em> äußere Anregung --- entspricht
            den drei Dämpfungsfällen aus der gedämpften freien Schwingung. Im realen Experiment liegt
            in der Regel der <strong>Schwingfall</strong> ($\\beta < \\omega_0$) vor:
        `;

export const t4Text5b = `
            $$\\varphi_h(t) = e^{-\\beta t}\\!\\left(c_1\\cos(\\omega_d t) + c_2\\sin(\\omega_d t)\\right),
              \\qquad \\omega_d = \\sqrt{\\omega_0^2 - \\beta^2}$$
        `;

export const t4Text5spoiler = `
            <strong>Schwache Dämpfung</strong> ($\\beta < \\omega_0$) --- Schwingfall:
            $$\\varphi_h(t) = e^{-\\beta t}\\!\\left(c_1\\cos(\\omega_d t) + c_2\\sin(\\omega_d t)\\right),
              \\quad \\omega_d = \\sqrt{\\omega_0^2-\\beta^2}$$
            <strong>Kritische Dämpfung</strong> ($\\beta = \\omega_0$) --- Aperiodischer Grenzfall:
            $$\\varphi_h(t) = (C_1 + C_2 t)\\,e^{-\\beta t}$$
            <strong>Starke Dämpfung</strong> ($\\beta > \\omega_0$) --- Kriechfall:
            $$\\varphi_h(t) = C_1 e^{\\lambda_1 t} + C_2 e^{\\lambda_2 t},
              \\quad \\lambda_{1,2} = -\\beta \\pm \\sqrt{\\beta^2 - \\omega_0^2} \\in \\mathbb{R}$$
        `;

export const t4Text5c = `
            Die Konstanten $c_1, c_2$ ergeben sich in allen Fällen aus den Anfangsbedingungen.
            Im <strong>stationären Zustand</strong> klingt die homogene Lösung vollständig ab ---
            übrig bleibt nur die partikuläre Lösung.
        `;

export const t4Text6a = `
            Die vollständige Lösung ergibt sich als Summe der homogenen und partikulären Lösung.
            Für den Schwingfall ($\\beta < \\omega_0$):
        `;

export const t4Text6b = `
            $$\\varphi(t) = \\underbrace{\\varphi_0\\cos(\\omega_d t+\\phi)\\,e^{-\\beta t}}_{\\text{Einschwingvorgang}}
              + \\underbrace{\\dfrac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}
              \\cos\\!\\left(\\omega t - \\Phi\\right)}_{\\text{Stationäre Antwort}}$$
        `;

export const t4Text6c = `
            Physikalisch überlagern sich zwei Schwingungen: die freie Schwingung $\\varphi_h$ und die
            erzwungene $\\varphi_p$. Nach einer gewissen <strong>Einschwingzeit</strong> klingt
            $\\varphi_h(t)$ ab --- danach schwingt das System nur noch mit der aufgezwungenen Frequenz
            $\\omega$ im <strong>stationären Zustand</strong>.<br><br>
            Im <strong>Phasenraumdiagramm</strong> ist der Abschluss des Einschwingvorgangs gut
            erkennbar: Die Trajektorie wird zu einer <strong>geschlossenen, stabilen Ellipse</strong>.
        `;

export const t4Text7a = `
            Im stationären Zustand ($\\varphi \\approx \\varphi_p$) schwingt das System mit der
            Anregungsfrequenz $\\omega$. Die <strong>Amplitude</strong> hängt vom Verhältnis
            zwischen Anregungsfrequenz und Eigenfrequenz ab:
        `;

export const t4Text7b = `
            $$\\varphi_0(\\omega) = \\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}$$
        `;

export const t4Text7c = `
            Die <strong>Resonanzfrequenz</strong> --- bei der die Amplitude maximal wird --- ist etwas
            kleiner als die Eigenfrequenz:
            $$\\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2}$$
            Mit zunehmender Dämpfung $\\beta$ verschiebt sich $\\omega_r$ stärker von $\\omega_0$ weg
            und die Maximalamplitude nimmt ab. Bei starker Dämpfung ($\\beta > \\omega_0/\\sqrt{2}$)
            tritt kein Resonanzpeak mehr auf.
        `;

export const t4Text8a = `
            Im stationären Zustand hinkt das Schwungrad dem Antrieb hinterher. Die
            <strong>Phasenverschiebung</strong> zwischen Antrieb $N\\cos(\\omega t)$ und
            Systemantwort $\\varphi_p(t) = \\varphi_0\\cos(\\omega t - \\Phi)$ beträgt:
        `;

export const t4Text8b = `
            $$\\Phi(\\omega) = \\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)$$
        `;

export const t4Text8c = `
            Besonders charakteristisch: Wenn die Anregungsfrequenz genau der
            <a data-glossary="natural-frequency" class="glossary-link">Eigenfrequenz</a>
            $\\omega_0$ entspricht, gilt stets
            $\\Phi(\\omega_0) = \\pi/2$ - unabhängig von der Dämpfung. Diese Eigenschaft
            lässt sich im Experiment nutzen, um $\\omega_0$ zu bestimmen.<br><br>
            Für $\\omega < \\omega_0$ gilt $\\Phi < \\pi/2$ (Antrieb und System nahezu in Phase),
            für $\\omega > \\omega_0$ gilt $\\Phi > \\pi/2$ (System läuft dem Antrieb stark hinterher).
        `;
