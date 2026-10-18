# Elenco puntato

Gli elenchi negli articoli e nei testi lunghi, puntati o numerati, con il segno in Geist Mono tra parentesi quadre nel margine dell'elenco.

- **Non numerato:** un quadretto pieno di 5px in `inchiostro-muto` tra parentesi quadre, `[ ■ ]`. Niente pallini tondi: il tondo è solo della sfera e degli stati. Niente parentesi vuote: sembrano caselle da spuntare.
- **Numerato:** due cifre tra parentesi quadre, `[ 01 ]`. Il segno non numerato è anche quello delle etichette di sezione, in `onda`.
- **Misure:** segno in `testo-etichetta` (14px), spaziatura 1px, `inchiostro-muto`, in una colonna di 72px. Testo come il corpo dell'articolo (`testo-corpo`, 20px, interlinea 1,7, `inchiostro-corpo`). Su mobile testo a 18px, segno a 13px e colonna del segno di 56px. Voci separate da `filetto`, un filetto anche sopra la prima, 14px sopra e sotto ogni voce (eccezione voluta alla scala degli spazi). `space-8` tra l'elenco e i paragrafi.
- **Niente arancio:** un elenco non è un'azione.
- **Movimento:** si anima solo il segno, il testo resta fermo. Quando l'elenco entra nello schermo, una volta sola, le parentesi si aprono di 4px e compaiono; 120ms dopo il quadretto cresce da zero, o il numero sale di 4px e sfuma dentro. Ogni voce parte 60ms dopo la precedente, 320ms con `cubic-bezier(0.2, 0.7, 0.2, 1)`. All'hover (e a `:focus-within`) le parentesi si stringono di 3px verso il segno, in 200ms, e tornano quando il mouse esce; il cursore resta quello del testo. Solo con `hover: hover` e a entrata finita (classe `fermo`). Niente animazione da un'ancora, tornando indietro o con `prefers-reduced-motion`; senza JavaScript tutto è già visibile.
- **Accessibilità:** `ul` e `ol` veri; il segno è `aria-hidden`, la numerazione arriva allo screen reader dall'`ol`.
- Le voci speciali di un solo articolo restano nell'articolo, non entrano nel componente.
