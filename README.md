# js-uno

js-uno er en javascript udgave af kortspillet Uno.

Formålet med projektet er at demonstrere hvordan classes kan bruges i javascript.

Live demo: https://rts-cmk.github.io/js-uno/

## Classes
### UnoCard:
Denne klasse repræsenterer et Uno kort. constructoren tager følgende parametre:
* color: *en string der repræsenterer kortets farve*
* value: *en string der repræsenterer kortets værdi*
* special (default: null): *en string der repræsenterer kortets specialværdi (fx skip, reverse, draw-two, draw-four, wild)*

#### Instance Properties:
* color: String: *farven på kortet*
* value: String: *værdien på kortet*
* special: String: *specialværdien på kortet*
* element: HTMLElement: *HTML elementet der repræsenterer kortet*
* value: Number: *kortets point-værdi (0-9 for tal, 20 for skip, reverse, draw-two, 50 for draw-four, wild)*

#### Instance Methods:
* isPlayableOn(card): Boolean: *returnerer om kortet kan spilles på et andet kort*

#### Static Methods:
* randomColor(): String: *returnerer en tilfældig farve (red, green, blue, yellow)*


### UnoDeck:
Denne klasse repræsenterer et sæt Uno kort. constructoren tager følgende parametre:
* cards (default: null): *et UnoCard object eller flere UnoCard objekter i en array*

#### Instance Properties:
* cards: Array: *returnerer et array af UnoCard objekter*
* size: Number: *returnerer størrelsen af kortstakken*
* topCard: UnoCard: *returnerer det øverste kort i kortstakken*

#### Instance Methods:
* add (card): *tilføjer et UnoCard objekt til "toppen"*
* remove (card): *fjerner et bestemt UnoCard objekt*
* shuffle (): *blander rækkefølgen af UnoCard objekter*
* draw (amount): *trækker et eller flere UnoCard objekter fra "toppen"*
* sort (): *sorterer UnoCard objekterne efter farve (red -> yellow -> green -> blue) og værdi (0 -> 9)*
* playableCards (topCard): *returnerer et array af UnoCard objekter der kan spilles på topCard*
* forEach (callback): *kører callback funktionen for hvert UnoCard objekt i UnoDeck*
* create (): *opretter et standard UnoDeck med 108 UnoCard objekter*


