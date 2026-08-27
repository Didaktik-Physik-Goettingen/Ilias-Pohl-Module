export const dampedOscText1a = `
		Sie haben sich bereits mit drei wichtigen physikalischen Bauelementen des Versuchs vertraut gemacht, dem Schwungrad, der Feder und der Wirbelstrombremse. In diesem Abschnitt werden Sie sich damit auseinandersetzen, wie man den Einfluss dieser unterschiedlichen Bauelemente auf die Dynamik des Schwungrads modellieren kann.<br><br>

        Wie Sie bereits gelesen haben, wirken sowohl die Feder, als auch (indirekt) die Wirbelstrombremse ein
		<a data-glossary="angular-momentum" class="glossary-link">Drehmoment</a>
		auf das Schwungrad aus.
        Die Wirkung der Feder hängt hierbei vom Winkel $\\varphi$ ab --- $M = -D\\varphi$ mit dem
		<a data-glossary="directive-moment" class="glossary-link">Richtmoment</a>
		$D$ ---
        die Wirkung der Wirbelstrombremse hängt von der Winkelgeschwindigkeit $\\dot{\\varphi}$ ab --- $M = -\\rho\\dot{\\varphi}$ mit dem Reibungskoeffizienten $\\rho$.
        <br><br>
        Mit diesen Annahmen können wir die Bewegungsgleichung für die Rotationsbewegung aufstellen.
        <br><br>
        Für Rotationsbewegungen gilt im Allgemeinen, dass
        $$\\Theta\\ddot{\\varphi} = \\sum_i M_i,$$
        wobei $\\Theta$ das
		<a data-glossary="moment-of-inertia" class="glossary-link">Trägheitsmoment</a>
		ist.<br><br>
`;

export const dampedOscText1b = `
		Das Aufstellen der Bewegungsgleichung für Rotationsbewegungen erfolgt analog zum Aufstellen von Bewegungsgleichungen für lineare Bewegungen. Es ist allerdings zu beachten, dass nicht die Kräfte, sondern die Drehmomente gleichgesetzt werden. Während die Bewegungsgleichung für lineare Bewegungen $m\\ddot{x}=\\sum_iF_i$ aus der Impulserhaltung abgeleitet werden können, resultiert die Bewegungsgleichung für Rotationsbewegungen aus der Drehimpulserhaltung.
`;

export const dampedOscText1c = `
		Die
		<a data-glossary="hom-dgl" class="glossary-link">Differentialgleichung</a>
		für die Bewegung des Schwungrads lautet also
		$$\\Theta\\ddot{\\varphi}+\\rho\\dot{\\varphi}+D\\varphi=0$$
		Häufig verwendet man die sogenannte "Normalform", also die Form, in der kein zusätzlicher Faktor in dem Term mit der höchsten Ableitung steht. In dieser Form lautet die
		<a data-glossary="hom-dgl" class="glossary-link">Differentialgleichung</a>
		:
`;

export const dampedOscText1d = `
		$$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega^2_0\\varphi=0$$
`;

export const dampedOscText1e = `
		mit den Abkürzungen $2\\beta:=\\rho/\\Theta$ ($\\beta$:
		<a data-glossary="damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>;
		die Wahl des Faktor 2 ist hier zunächst beliebig, es zeigt sich in der Lösung der Gleichung, dass diese Wahl geschickt ist) und  $\\omega_0^2:=D/\\Theta$ ($\\omega_0$:
		<a data-glossary="natural-frequency" class="glossary-link">ungedämpfte Eigenfrequenz</a>
		).
`;

export const dampedOscText2a = `
		Diese
		<a data-glossary="hom-dgl" class="glossary-link">Differentialgleichung</a>
		beschreibt, bis auf Anfangsbedingungen, das System vollständig, die Lösung der Gleichung gibt aber einen deutlich besseren Einblick darein, wie die Bewegung möglicherweise aussieht.<br><br>

		Zur Lösung der
		<a data-glossary="hom-dgl" class="glossary-link">Differentialgleichung</a>
		kann der sogenannte
		<a data-glossary="exponential-ansatz" class="glossary-link">Exponentialansatz</a>
		verwendet werden.
		Dieser Ansatz bietet sich bei vielen Bewegungsgleichungen an und die grundsätzliche Idee ist, dass man annimmt die Lösung sei von der Form $\\varphi(t)=exp(\\lambda t)$ und dann durch Einsetzen schaut, für welche $\\lambda$ dieser Ansatz gerechtfertigt ist.
`;

export const dampedOscText2b = `
		Zum Lösen der Differentialgleichung verwenden wir den Exponentialansatz. Dieser bietet sich in unserem Fall an, da alle Terme die Funktion selbst ($\\varphi(t)$) und deren Ableitungen enthalten.
		<br><br>
		Wir verwenden also den Ansatz $\\varphi(t)=\\exp(\\lambda t)$.
		Wir gehen davon aus, dass die tatsächliche Lösung eine Linearkombination von Funktionen dieser Form ist, dass also gilt $\\varphi(t)=\\sum_{i=1}^n a_i\\exp(\\lambda_i t)$, wobei $n$ den Grad der höchsten Ableitung in der Bewegungsgleichung darstellt.
		<br><br>
		Im nächsten Schritt setzen wir diesen Ansatz in unsere Differentialgleichung ein:
		$$\\ddot{\\varphi}+2\\beta\\dot{\\varphi}+\\omega_0^2\\varphi=0$$
		$$-\\lambda^2\\exp(\\lambda t)+2i\\beta\\lambda\\exp(\\lambda t)+\\omega_0^2\\exp(\\lambda t)=0$$
		$$-\\lambda^2\\varphi(t)+2i\\beta\\lambda\\varphi(t)+\\omega_0^2\\varphi(t)=0$$
		$$(-\\lambda^2+2i\\beta\\lambda+\\omega_0^2)\\varphi(t)=0$$
		<br>
		Nun müssen wir schauen, für welche Werte $\\lambda$ diese Gleichung gelöst wird, wir setzen also $-\\lambda^2+2i\\beta\\lambda+\\omega_0^2=0$ und finden als Bedingung für $\\lambda$:
		$$\\lambda_{1,2}=-i\\beta\\pm\\sqrt{-\\beta^2+\\omega_0^2}=-i\\beta\\pm\\sqrt{\\omega_0^2-\\beta^2}$$
		<br>
		Der Wurzel-Ausdruck bedingt hierbei, dass es drei unterschiedliche Lösungen der Differentialgleichung gibt, da die Wurzel größer, kleiner oder gleich Null sein kann. Diese Fälle beschreiben den Kriechfall, aperiodischen Grenzfall oder den Schwingfall.
		<br><br>
		Für den Schwingfall, der bei $\\beta^2<\\omega_0^2$ eintritt, und den Kriechfall, der bei $\\beta^2>\\omega_0^2$ eintritt, ergibt sich als Lösung:
		$$\\varphi(t)=c_1\\exp(\\lambda_1 t)+c_2\\exp(\\lambda_2 t),$$
		wobei $c_1$ und $c_2$ komplexe Zahlen sind, deren Größe sich aus den Anfangsbedingungen (Auslenkung und Geschwindigkeit) ergibt.
		<br><br>
		Einsetzen der $\\lambda$-Werte, Ausklammern des Terms $\\exp(-\\beta t)$ und Umformen der Gleichung ergibt die unten stehende Gleichung.
		<br><br>
		Für den aperiodischen Grenzfall, der bei $\\beta^2=\\omega_0^2$ eintritt, ergibt sich als Lösung:
		$$\\varphi(t)=c_1\\exp(\\lambda t)+c_2 t\\exp(\\lambda t),$$
		wobei zu beachten ist, dass die zusätzliche lineare Abhängigkeit von $t$ im zweiten Term daraus resultiert, dass in diesem Spezialfall $\\lambda_1=\\lambda_2=\\lambda$ gilt.
		(Für weitere Begründungen referenzieren wir an dieser Stelle auf die Rechenmethoden-Vorlesungen bzw. auf Grundlagenliteratur in diesem Gebiet.)
`;

export const dampedOscText2c = `
		Für den <b>Schwingfall</b> ($\\omega_0^2>\\beta^2$), wenn also die Dämpfung klein im Vergleich zur <a data-glossary="natural-frequency" class="glossary-link">Eigenfrequenz</a>
		des Systems ist, kann die Lösung in zwei äquivalenten Weisen angegeben werden:
`;

export const dampedOscText2d = `
		$$\\varphi(t)=(a\\sin(\\omega_e t)+b\\cos(\\omega_e t))e^{-\\beta t}$$
		bzw.
		$$\\varphi(t)=\\varphi_0\\cos(\\omega_e t+\\phi)e^{-\\beta t},$$
		wobei $\\omega_e=\\sqrt{\\omega_0^2-\\beta^2}$ die Eigenfrequenz des (gedämpften) Systems ist.
`;

export const dampedOscText2e = `
		Zur Erinnerung: $\\beta$ ist der
		<a data-glossary="damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>
		und $\\omega_0$ die
		<a data-glossary="natural-frequency" class="glossary-link">ungedämpfte Eigenfrequenz</a>
		, die durch
		<a data-glossary="directive-moment" class="glossary-link">Richtmoment</a>
		und
		<a data-glossary="moment-of-inertia" class="glossary-link">Trägheitsmoment</a>
		bestimmt ist.
		<br><br>
		Die Variablen $a$ und $b$ in der obigen Gleichung sowie $\\varphi_0$ (
		<a data-glossary="amplitude" class="glossary-link">Maximalamplitude</a>
		) und $\\phi$ (Phasenverschiebung) in der unteren Gleichung ergeben sich aus den Anfangsbedingungen (Anfangsauslenkung und -geschwindigkeit).
		<br><br>
		Die
		<a data-glossary="natural-frequency" class="glossary-link">gedämpfte Eigenfrequenz</a>
		kann im Experiment aus der Periodenlänge $T=\\frac{1}{\\omega_e}$ bestimmt werden.
`;

export const dampedOscText3a = `
		In der linken Abbildung ist exemplarisch der zeitliche Verlauf der Winkelauslenkung eines gedämpften Systems dargestellt, wobei die Anfangsauslenkung $x_0>0$ und die Anfangsgeschwindigkeit $v_0=0$ sind.<br><br>

		Die blaue Kurve zeigt jeweils die Winkelauslenkung des Rades über die Zeit, die rote gestrichelte Kurve deutet die abnehmende
		<a data-glossary="amplitude" class="glossary-link">Amplitude</a>
		über die Zeit an — sie wird auch Einhüllende genannt.<br><br>

		Je stärker der Überlapp zwischen Magnet und Schwungrad, desto schneller nimmt die
		<a data-glossary="amplitude" class="glossary-link">Amplitude</a>
		des Systems ab. In den Abbildungen links nimmt die Dämpfung von oben nach unten zu, in der untersten Abbildung zeichnet sich bereits der Übergang zum
		<a data-glossary="critical-damping" class="glossary-link">aperischen Grenzfall</a>
		ab.<br><br>

		Kennt man den zeitlichen Verlauf, so kann das Verhältnis der
		<a data-glossary="amplitude" class="glossary-link">Amplituden</a>
		in Kombination mit der Periodendauer $T$ genutzt werden, um den
		<a data-glossary="damping-coefficient" class="glossary-link">Dämpfungskoeffizient</a>
		$\\beta$ zu bestimmen.<br><br>

		Als zusätzliche Hilfsgröße zur Analyse der Dämpfung wird hierfür das „logarithmische Dekrement" $\\Lambda$, das sich explizit auf das Verhältnis benachbarter Maxima (zeitlicher Abstand = Periodendauer $T$) bezieht:
		$$\\Lambda=\\ln\\left(\\frac{\\varphi(t)}{\\varphi(t+T)}\\right)=\\ln(\\exp(\\beta T))=\\beta T.$$
`;

export const dampedOscText3b = `
		$$\\Lambda=\\ln\\left(\\frac{\\varphi(t)}{\\varphi(t+T)}\\right)$$
		Setzen wir hier die allgemeine Lösung der Differentialgleichung von der vorangegangenen Seite ein, erhalten wir:
		$$\\Lambda=\\ln\\left(\\frac{\\varphi_0\\cos(\\omega_e t+\\phi)\\exp(-\\beta t)}{\\varphi_0\\cos(\\omega_e(t+T)+\\phi)\\exp(-\\beta(t+T))}\\right)$$
		Beachten wir die Periodizität der Cosinus-Funktion, also dass $\\cos(\\omega t+\\phi)=\\cos(\\omega(t+T)+\\phi)$, und die Additivität der Exponentialfunktion $\\exp(a+b)=\\exp(a)\\exp(b)$, ergibt sich:
		$$\\Lambda=\\ln\\left(\\frac{\\varphi_0\\cos(\\omega_e t+\\phi)\\exp(-\\beta t)}{\\varphi_0\\cos(\\omega_e t+\\phi)\\exp(-\\beta t)\\exp(-\\beta T)}\\right)$$
		Damit können wir einige Faktoren kürzen und erhalten den behaupteten Zusammenhang:
		$$\\Lambda=\\ln(\\exp(\\beta T))=\\beta T.$$
`;
