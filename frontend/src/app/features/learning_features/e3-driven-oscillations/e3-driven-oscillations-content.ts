export const drivenOscText1a = `
			Neben einer Wirbelstrombremse zur Dämpfung, verfügt der Aufbau auch über einen externen Antrieb. Über einen Schrittmotor, der über eine Software angesteuert wird, kann hierbei das Rad zusätzlich periodisch in Bewegung versetzt werden. Hierbei kann einerseits die Frequenz und andererseits die
            <a data-glossary="amplitude" class="glossary-link">Amplitude</a>
            verändert werden.<br><br>

			Da der externe Antrieb über ein Rad realisiert wird, kann dieser mathematisch modelliert werden als zusätzlicher Beitrag zur
			<a data-glossary="inhom-dgl" class="glossary-link">Differentialgleichung</a>
			mit $F_\\text{ext}=A\\cos(\\omega t)$, wobei $\\omega$ die Frequenz des Antriebs ist und $A$ mit dessen <a data-glossary="amplitude" class="glossary-link">Amplitude</a>
            in Zusammenhang steht.
			Während die Frequenz über eine digitale Ansteuerung des Schrittmotors eingestellt wird, kann die Amplitude manuell durch Verschieben an der rechten Scheibe verändert werden.<br><br>

			Insgesamt ist die
			<a data-glossary="inhom-dgl" class="glossary-link">Differentialgleichung</a>
			zur Beschreibung der Bewegung des Rades mit Dämpfung ($\\Theta$:
			<a data-glossary="moment-of-inertia" class="glossary-link">Trägheitsmoment</a>,
			$\\rho$: Reibungskoeffizient, $D^*$:
			<a data-glossary="directive-moment" class="glossary-link">Richtmoment</a>
			der Feder) und externem Antrieb gegeben als:
			$$\\Theta\\ddot{\\varphi}+\\rho\\dot{\\varphi}+D^*\\varphi=A\\cos(\\omega t)$$
			In der Regel wird diese Gleichung in normierter Form betrachtet; wie bereits zuvor werden neue Variablen eingeführt:
			$$2\\beta:=\\frac{\\rho}{\\Theta},\\quad\\omega_0^2:=\\frac{D^*}{\\Theta},\\quad N:=\\frac{A}{\\Theta}.$$
			Diese Umbenennung vereinfacht die Schreibweise und entspricht der „Standardform" einer
			<a data-glossary="inhom-dgl" class="glossary-link">inhomogenen linearen Differentialgleichung</a>
			2. Ordnung:
        `;

export const drivenOscText1b = `
			$$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega_0^2\\varphi=N\\cos(\\omega t).$$
        `;

export const drivenOscText1c = `
			Beachte, dass hierbei $\\omega_0$ und $\\omega$ unterschiedliche Frequenzen sind, die nicht direkt in Zusammenhang miteinander stehen — während $\\omega_0$ die
			<a data-glossary="natural-frequency" class="glossary-link">Eigenfrequenz</a>
			des ungedämpften Rades beschreibt, ist $\\omega$ die Frequenz des Antriebs. Zur Erinnerung: $\\beta$ ist der
			<a data-glossary="damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>.
        `;

export const drivenOscText2a = `
            Die Lösung der
            <a data-glossary="inhom-dgl" class="glossary-link">inhomogenen Differentialgleichung</a>
            $$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega_0^2\\varphi=N\\cos(\\omega t)$$
            ergibt sich aus der Summe von homogener und spezieller Lösung:
            $$\\varphi(t)=\\varphi_\\text{homogen}(t)+\\varphi_\\text{speziell}(t).$$

            Die Lösung der homogenen Gleichung (ohne externen Antrieb) wurde bereits auf den vergangenen Seiten verwendet. Sie kann geschrieben werden als:
            $$\\varphi_\\text{homogen}=\\varphi_0\\cos(\\omega_e t+\\Phi)\\,e^{-\\beta t},$$
            wobei sich die maximale Auslenkung $\\varphi_0$ und die Phase $\\Phi$ aus den Anfangsbedingungen ergeben und $\\omega_e=\\sqrt{\\omega_0^2-\\beta^2}$ ($\\omega_0$:
            <a data-glossary="natural-frequency" class="glossary-link">Eigenfrequenz</a>
            des Systems; $\\beta$:
            <a data-glossary="damping-coefficient" class="glossary-link">Dämpfungskonstante</a>
            ).<br><br>

            Um eine spezielle Lösung zu finden, ist es ratsam, einen Ansatz zu wählen, der der Inhomogenität (in diesem Fall $N\\cos(\\omega t)$) ähnelt.<br><br>

            Eine Möglichkeit wäre als Ansatz $\\varphi_\\text{speziell}=\\varphi_s\\cos(\\omega t+\\Phi_s)$ zu wählen. Man setzt diesen Ansatz in die
            <a data-glossary="inhom-dgl" class="glossary-link">Differentialgleichung</a>
            ein und bestimmt hieraus die beiden Variablen $\\varphi_s$ und $\\Phi_s$.<br><br>

            Eine andere Möglichkeit, bei der die Rechnung an einigen Stellen etwas leichter ist, wirkt zunächst wie ein Umweg: Man erweitert die Inhomogenität komplex. Statt $N\\cos(\\omega t)$ betrachtet man $Ne^{i\\omega t}$ — beachte $N\\cos(\\omega t)=\\text{Re}\\{Ne^{i\\omega t}\\}$. Mit dem Ansatz $\\tilde{\\varphi}_\\text{speziell}=Ae^{i\\omega t}$ (A komplexwertig) setzt man diesen in die
            <a data-glossary="inhom-dgl" class="glossary-link">inhomogene Differentialgleichung</a>
            ein und bestimmt $A$. Die spezielle Lösung ergibt sich dann als $\\text{Re}\\{\\tilde{\\varphi}_\\text{speziell}\\}$.
        `;

export const drivenOscText2b = `
            Wir verwenden den komplexen Erweiterungsansatz. Ausgangspunkt ist die inhomogene Differentialgleichung:
            $$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega_0^2\\varphi=N\\cos(\\omega t).$$

            Anstatt der Inhomogenität $N\\cos(\\omega t)$ betrachten wir die komplexifizierte Gleichung mit der Inhomogenität $Ne^{i\\omega t}$
            und wählen den Ansatz $\\tilde{\\varphi}_\\text{speziell}=Ae^{i\\omega t}$, wobei $A\\in\\mathbb{C}$ komplexwertig ist.
            Beachte: $N\\cos(\\omega t)=\\text{Re}\\{Ne^{i\\omega t}\\}$, weshalb sich die gesuchte spezielle Lösung am Ende als Realteil ergibt.<br><br>

            Die Ableitungen des Ansatzes sind:
            $$\\dot{\\tilde{\\varphi}}=i\\omega A e^{i\\omega t},\\qquad\\ddot{\\tilde{\\varphi}}=-\\omega^2 A e^{i\\omega t}.$$

            Einsetzen in die Differentialgleichung und Division durch $e^{i\\omega t}\\neq 0$ liefert:
            $$A\\left(\\omega_0^2-\\omega^2+2i\\beta\\omega\\right)=N\\quad\\Rightarrow\\quad
            A=\\frac{N}{\\omega_0^2-\\omega^2+2i\\beta\\omega}.$$

            Zur Berechnung des Realteils multiplizieren wir mit dem konjugiert-komplexen Nenner:
            $$A=\\frac{N(\\omega_0^2-\\omega^2-2i\\beta\\omega)}{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}.$$

            Wir schreiben $A=|A|\\,e^{-i\\Phi_s}$ in Polarform:
            $$|A|=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}},\\qquad
            \\Phi_s=\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right).$$

            Die spezielle Lösung der ursprünglichen Gleichung ergibt sich schließlich als:
            $$\\varphi_\\text{speziell}=\\text{Re}\\{\\tilde{\\varphi}_\\text{speziell}\\}=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos(\\omega t-\\Phi_s).$$
        `;

export const drivenOscText2c = `
            Als Gesamtlösung des Systems ergibt sich nach dem vorgestellten Schema:
            $$\\varphi(t)=\\underbrace{\\varphi_0\\cos(\\omega_e t+\\Phi)\\,e^{-\\beta t}}_{\\text{homogen}}+\\underbrace{\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t-\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)\\right)}_{\\text{speziell}}$$

            Der erste Summand entspricht der homogenen Lösung, der zweite der speziellen Lösung. Der erste Term beschreibt das „freie" Schwingverhalten des Pendels; der zweite Term beinhaltet die Reaktion des Systems auf die externe Anregung.
        `;

export const drivenOscText3a = `
            Im Versuch zur getriebenen Schwingung werden Sie sich auf eine Analyse der stationären Schwingung (nach der Einschwingphase),
            also auf den zweiten Term der Gesamtlösung, fokussieren.
            Da ein reales System immer gedämpft ist und sich daher nach einer Einschwingphase immer eine stationäre Lösung einstellt,
            ist diese Betrachtung im Realexperiment sinnvoll:
            $$\\varphi(t)=\\underbrace{\\varphi_0\\cos(\\omega_e t+\\Phi)\\,e^{-\\beta t}}_{\\xrightarrow{\\;t\\to\\infty\\;}\\,0}
            +\\underbrace{\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t-\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)\\right)}_{\\text{stationäre Lösung}}$$

            Wenn die Einschwingphase abgeschlossen ist, spielen die Anfangsbedingungen eine untergeordnete Rolle
            und das System schwingt periodisch mit der Frequenz $\\omega$ des Antriebs.<br><br>

            Der Zeitpunkt, zu dem die Einschwingphase abgeschlossen ist, ist sehr gut im sogenannten Phasenraumdiagramm sichtbar.
            In einem Phasenraumdiagramm wird die (Winkel-)geschwindigkeit über den Winkel aufgetragen.
        `;

export const drivenOscText4 = `
            Im Folgenden betrachten wir nur die stationäre Lösung der Gleichung, also
            $$\\varphi(t)=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t-\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)\\right).$$

            Zunächst beschäftigen wir uns mit der
            <a data-glossary="amplitude" class="glossary-link">Amplitude</a>
            :
            $$\\varphi_0(\\omega)=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}.$$

            Sie haben sicher schon von dem Phänomen der „Resonanzkatastrophe" gehört. Man spricht hiervon, wenn die
            <a data-glossary="amplitude" class="glossary-link">Amplitude</a>
            der Schwingung, bedingt durch die äußere Anregung, stark zunimmt. Doch wovon hängt es ab, ob es zu einer „Resonanzkatastrophe" kommt?
        `;

export const drivenOscText5a = `
            Richtig, das Zusammenspiel unterschiedlicher Aspekte beeinflusst die Amplitude der Schwingung.
            Im Versuch werden Sie nicht alle Parameter variieren können. Der Versuchsaufbau erlaubt Ihnen einerseits die Anpassung der Dämpfung,
            andererseits die Anpassung der Amplitude und Frequenz des Antriebs.<br><br>

            Mathematisch ist die Amplitude gegeben als:
            $$\\varphi_0(\\omega)=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}.$$
        `;

export const drivenOscText5b = `
            Die Abbildung zeigt den Zusammenhang zwischen der normierten
            <a data-glossary="amplitude" class="glossary-link">Amplitude</a>
            des Schwungrads und der Anregungsfrequenz $\\omega$
            für unterschiedliche
            <a data-glossary="damping-coefficient" class="glossary-link">Dämpfungskonstante</a>
            $\\beta$ bei einem gleichbleibenden System
            ($\\omega_0$ ist im Versuch nicht variabel und dient hier daher zur Normierung).<br><br>

            Beachten Sie, dass die
            <a data-glossary="amplitude" class="glossary-link">Amplitude</a>
            der Anregung ($N$) in $\\varphi_0(0)$ enthalten ist.<br><br>

            Die graue gestrichelte Kurve zeigt die normierte
            <a data-glossary="amplitude" class="glossary-link">Amplitude</a>
            bei der
            <a data-glossary="resonance-frequency" class="glossary-link">Resonanzfrequenz</a>
            für unterschiedliche Dämpfungen.<br><br>

            Die
            <a data-glossary="resonance-frequency" class="glossary-link">Resonanzfrequenz</a>
            gibt die Frequenz an, bei der die
            <a data-glossary="amplitude" class="glossary-link">Amplitude</a>
            des schwingenden Rades maximal wird.
            Mathematisch ergibt sie sich zu:
            $$\\omega_r=\\sqrt{\\omega_0^2-2\\beta^2}.$$
        `;

export const drivenOscText6 = `
            Im stationären Zustand hinkt ein gedämpftes Schwungrad dem Antrieb hinterher. Wie die Amplitude, so hängt auch die Phasenverschiebung von der Dämpfung $\\beta$, der
            <a data-glossary="natural-frequency" class="glossary-link">Eigenfrequenz</a>
            $\\omega_0$ und der Frequenz des Antriebs $\\omega$ ab.<br><br>

            Gehen wir zurück auf die stationäre Lösung des gedämpften, getriebenen Systems:
            $$\\varphi(t)=\\frac{N}{\\sqrt{(\\omega_0^2-\\omega^2)^2+4\\beta^2\\omega^2}}\\cos\\!\\left(\\omega t-\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)\\right).$$

            Vergleichen wir diese Gleichung mit dem Antrieb des Systems,
            $$\\varphi_\\text{ext}=N\\cos(\\omega t),$$
            so fällt auf, dass die Argumente der Cosinus-Funktionen sich unterscheiden. Dieser Unterschied entspricht einer Phasenverschiebung $\\Phi$:
            $$\\Phi(\\omega)=\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right).$$
        `;

export const drivenOscText7 = `
            In der nebenstehenden Abbildung ist die Phasenverschiebung
            $$\\Phi(\\omega)=\\arctan\\!\\left(\\frac{2\\beta\\omega}{\\omega_0^2-\\omega^2}\\right)$$
            für unterschiedliche
            <a data-glossary="damping-coefficient" class="glossary-link">Dämpfungskonstanten</a>
            $\\beta$ dargestellt.<br><br>

            Es zeigt sich, dass die
            <a data-glossary="natural-frequency" class="glossary-link">Eigenfrequenz</a>
            $\\omega_0$ einen charakteristischen Punkt darstellt:
            Entspricht die Anregungsfrequenz gerade der
            <a data-glossary="natural-frequency" class="glossary-link">Eigenfrequenz</a>
            , so ist die Phasenverschiebung $\\Phi(\\omega_0)=\\pi/2$.
        `;
