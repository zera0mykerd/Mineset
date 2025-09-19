import os

def cerca_stringa_in_file(percorso_file, stringa):
    try:
        with open(percorso_file, "r", encoding="utf-8", errors="ignore") as f:
            for numero_linea, linea in enumerate(f, start=1):
                if stringa in linea:
                    print(f"[TROVATO] {percorso_file} - linea {numero_linea}: {linea.strip()}")
    except Exception as e:
        print(f"Impossibile leggere {percorso_file}: {e}")

def main():
    stringa_da_cercare = input("Inserisci la stringa da cercare: ")
    cartella_corrente = os.getcwd()

    print(f"\nCerco '{stringa_da_cercare}' nei file di: {cartella_corrente}\n")

    for radice, _, files in os.walk(cartella_corrente):
        for nome_file in files:
            percorso_file = os.path.join(radice, nome_file)
            if os.path.isfile(percorso_file):
                cerca_stringa_in_file(percorso_file, stringa_da_cercare)

if __name__ == "__main__":
    main()
