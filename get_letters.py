import requests
import json

response = requests.get("https://old.reddit.com/user/NYTSpellingBeeBot/?limit=1")
print(response.text)
letter_list = response.text.split("data-url")[1].split('"')[1].split("/")[-2].split("_")
letters = {
    "keyLetter": letter_list[3].upper(),
    "ringLetters": [x.upper() for x in letter_list[4:]],
}
with open("app/letters.json", "w") as letters_file:
    print(json.dumps(letters))
    letters_file.write(json.dumps(letters))
