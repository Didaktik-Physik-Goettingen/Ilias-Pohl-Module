export const freeOscText1a = `
			Die
			<a data-glossary="hom-dgl" class="glossary-link">Differentialgleichung</a>
			des ungedämpften harmonischen Oszillators lautet:
		`;

export const freeOscText1b = `
			$$\\frac{d^2x}{dt^2} + \\omega_0^2x = 0$$
		`;

export const freeOscText1c = `
			Mit der Abkürzung $\\omega_0^2 = \\frac{D}{m}$ für die Masse $m$ und die
			<a data-glossary="spring-constant" class="glossary-link">Federkonstante</a>
			$D$ nennt man diese Gleichung:
			<ul>
				<li><strong>ungedämpft</strong>, weil keinerlei Dämpung betrachtet wird,</li>
				<li><strong>frei</strong>, weil keinerlei äußere Anregung existiert. Die rechte Seite der
				<a data-glossary="hom-dgl" class="glossary-link">Differentialgleichung</a>
				ist null. Deshalb heißt die Gleichung auch
				<a data-glossary="hom-dgl" class="glossary-link">homogene Differentialgleichung</a>,
				</li>
				<li><strong>harmonisch</strong>, weil die akustische Überlagerung von den entstehenden „reinen" Sinustönen als harmonisch empfunden wird.</li>
			</ul>
			Die DGL kann auch in der Newtonschen Notation geschrieben werden:
			$$\\ddot{x} + \\omega_0^2x = 0$$
		`;

export const freeOscText1d = `
			Gelöst werden kann die
			<a data-glossary="hom-dgl" class="glossary-link">Differentialgleichung</a>
			nun mit einem
			<a data-glossary="exponential-ansatz" class="glossary-link">Exponentialansatz </a>
			gelöst werden:
			$$x(t) = c \\cdot e^{\\lambda t}, \\quad c \\neq 0$$
			Dazu bestimmen wir die zeitlichen Ableitungen:
			$$\\dot{x}(t) = c\\lambda \\cdot e^{\\lambda t}$$
			$$\\ddot{x}(t) = c\\lambda^2 \\cdot e^{\\lambda t}$$
			Nun setzen wir den Ansatz und die zweite Ableitung in die
			<a data-glossary="hom-dgl" class="glossary-link">Differentialgleichung</a>
			ein:
			$$c\\lambda^2e^{\\lambda t} + c\\omega_0^2e^{\\lambda t} = ce^{\\lambda t}(\\lambda^2 + \\omega_0^2) = 0$$
			Da der Faktor vor der Klammer nicht für alle Zeiten null wird, muss die Klammer selbst null werden. Dadurch ergibt sich die Bestimmungsgleichung:
			$$\\lambda^2 + \\omega_0^2 = 0$$
			$$\\lambda^2 = -\\omega_0^2$$
			$$\\lambda_{1,2} = \\pm\\, i\\omega_0$$
			Es gibt also zwei komplexe Lösungen:
			$$x_1(t) = c_1e^{i\\omega_0t}, \\quad x_2(t) = c_2e^{-i\\omega_0t}$$
			Die allgemeine Lösung ist die Linearkombination dieser beiden Lösungen:
		`;

export const freeOscText1e = `
			$$x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t}$$
		`;

export const freeOscText1f = `
			Aus physikalischen Gründen muss die Lösung reell sein. Daher kann sie auch in folgender Form geschrieben werden:
			$$x(t) = c_1\\cos(\\omega_0t) + c_2\\sin(\\omega_0t)$$
		`;

export const freeOscText1g = `
			Da die Auslenkung physikalisch reell sein muss, muss die Funktion mit ihrer komplex konjugierten Funktion übereinstimmen:
			$$x(t) = x^*(t)$$
			Für die komplexe Lösung ergibt sich:
			$$x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t}$$
			$$x^*(t) = c_1^*e^{-i\\omega_0t} + c_2^*e^{i\\omega_0t}$$
			Vergleicht man die Koeffizienten der Exponentialterme, erhält man:
			$$c_1 - c_2^* = 0, \\quad c_1^* - c_2 = 0$$
			Das heißt: $c_2 = c_1^*$, die beiden komplexen Konstanten müssen komplex konjugiert zueinander sein.
			Mit $c = a + ib$, $a,b \\in \\mathbb{R}$ ergibt sich:
			$$x(t) = ce^{i\\omega_0t} + c^*e^{-i\\omega_0t}$$
			Beispielsweise können die Randbedingungen durch die Geschwindigkeit beim Nulldurchgang gegeben sein:
			$$x(t=0) := 0, \\quad \\dot{x}(t=0) = v_0 \\implies x(t) = \\frac{v_0}{\\omega_0}\\sin(\\omega_0t)$$
		`;

export const freeOscText1h = `
			Man kann allgemeiner zeigen, dass komplexe Lösungen des charakteristischen Polynoms bei einer reellen Ausgangsgleichung paarweise auftreten.<br><br>
			Ein komplex konjugiertes Paar besitzt die Form $\\lambda = \\alpha \\pm i\\beta$.
			Im ungedämpften Fall ist der Realteil null: $\\alpha = 0$.<br><br>
			Bei einer gedämpften harmonischen Schwingung treten zusätzlich Exponentialfaktoren auf:
			$$e^{\\alpha t}\\cos(\\beta t), \\quad e^{\\alpha t}\\sin(\\beta t)$$
		`;

export const freeOscText2a = `
			Der sogenannte Phasenraum beschreibt die Menge aller möglichen Zustände eines dynamischen Systems.
			Ausgehend von einer Bewegungsgleichung werden alle möglichen Kombinationen von
			$x(t)$ und $\\dot{x}(t)$ in einem Phasenraumdiagramm aufgetragen.
		`;

export const freeOscText2b = `
			$$\\frac{d^2x}{dt^2} + \\omega_0^2x = 0$$
		`;

export const freeOscText2c = `
			Für den ungedämpften harmonischen Oszillator mit der Rückstellkraft $F = -Dx$ gilt für die Energie:
			$$E = \\frac{m}{2}\\dot{x}^2 + \\frac{1}{2}Dx^2$$
			Mit $\\omega_0 = \\sqrt{\\frac{D}{m}}$ ergibt sich durch Umstellen eine Kreisgleichung:
			$$x^2 + \\left(\\frac{\\dot{x}}{\\omega_0}\\right)^2 = \\frac{2E}{D}$$
		`;

export const freeOscText2d = `
			Eine besonders anschauliche Darstellung des Schwingungsverhaltens ist im Phasenraum möglich.
			Für ein punktförmiges Teilchen im dreidimensionalen Ortsraum ist der Phasenraum als Menge aller
			Sechsertupel aus den drei Orts- und Impulskoordinaten definiert.<br><br>
			Beim Pohlschen Pendel sind sowohl die Orts- als auch die Impulskoordinate eindimensionale Größen.
			Der Phasenraum reduziert sich dadurch auf zwei Dimensionen.<br><br>
			Für einen ungedämpften Oszillator erhält man als Trajektorie einen Kreis.
			Sein Radius hängt mit der Energie des Systems zusammen: $R = \\sqrt{\\frac{2E}{D}}$.
			Für einen schwach gedämpften Oszillator erhält man hingegen eine Spirale zum Nullpunkt.
		`;
