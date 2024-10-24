import praw
import json
import os


reddit = praw.Reddit(
    client_id="Zqg7gm9ypYzr7D2HLa1dyQ",
    client_secret=os.getenv("reddit_secret"),
    user_agent="Spelling-Wye-0.1",
)
posts = reddit.redditor("NYTSpellingBeeBot").top(time_filter="day")

# I just want the most recent post out of this generator
new_post = posts.__next__()

print(new_post.url)

letter_list = new_post.url.split("/")[-2].split("_")
letters = {
    "keyLetter": letter_list[3].upper(),
    "ringLetters": [x.upper() for x in letter_list[4:]],
}
with open("app/letters.json", "w") as letters_file:
    print(json.dumps(letters))
    letters_file.write(json.dumps(letters))
