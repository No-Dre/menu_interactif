import csv
import sys

arg = sys.argv[1:]
if len(arg) % 2 != 0 or len(arg) == 0:
    print("invalide argument")
    exit(1)
data = []
final = ''
def addLanguage(language: str, id: int, data: str):
    language = language.lower()
    data.append(language)
    data.append(id)
    language = language[0].upper() + language[1:]
    data.append(language)
    data.append(id)
    language = language.upper()
    data.append(language)
    data.append(id)

with open('./public/db/db_Inforesource.csv', newline='') as file:
    spamreader = csv.reader(file, delimiter=';')
    for row in spamreader:
        data = row
    for i in range(0, len(arg) - 1, 2):
        addLanguage(arg[i], arg[i + 1], data)
    for val in range(0, len(data)):
        final += data[val]
        if val < len(data) - 1:
            final += ';'
    with open("./public/db/db_Inforesource.csv", "w") as f:
        f.write(final)
