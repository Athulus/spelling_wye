with open("./wordlist-20210729.txt", "r") as word_file:
    with open("./app/spelling-wye-words.js", "w") as new_file:
        for word in word_file:
            trimmed_word = word.replace('"', "")
            if len(trimmed_word) > 4:
                # write to new file
                new_file.write(trimmed_word)
