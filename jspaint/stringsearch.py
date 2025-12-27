#!/usr/bin/env python3
import os

def cerca_stringa(radice, stringa):
    for percorso_corrente, cartelle, files in os.walk(radice):
        for nome_file in files:
            percorso_file = os.path.join(percorso_corrente, nome_file)
            try:
                with open(percorso_file, "r", errors="ignore") as f:
                    for numero_linea, linea in enumerate(f, start=1):
                        if stringa in linea:
                            print(f"[TROVATO] {percorso_file}:{numero_linea}")
            except Exception as e:
                # File non leggibile (binario, permessi, ecc.)
                pass

if __name__ == "__main__":
    stringa = input("Inserisci la stringa da cercare: ").strip()
    cartella = os.path.dirname(os.path.abspath(__file__))
    print(f"Cerco '{stringa}' in: {cartella}\n")
    cerca_stringa(cartella, stringa)
