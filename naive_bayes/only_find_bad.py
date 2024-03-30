from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# List of bad words
bad_words = ["hồ chí mi", "cục phó", "cục văn hóa", "hoang loạn", "đồ ngốk", "háu gái", "ỉa", "tâm dâm", "hên vl", "cút", "óc chó"]

# List of words to classify
words_to_classify = ["hello", "đẹp trai", "đẹp trai quá", "hạt óc chó", "cục phó", "world", "ỉa", "mắc ỉa", "cút xéo", "cúttttttttt"]

# Create the bag-of-words representation
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(bad_words + words_to_classify)

# Create labels for bad words
bad_word_indices = [vectorizer.vocabulary_.get(word, -1) for word in bad_words]
labels = [0] * len(vectorizer.vocabulary_)
for idx in [idx for idx in bad_word_indices if idx != -1]:
    labels[idx] = 1

# Train the Naive Bayes classifier
clf = MultinomialNB()
clf.fit(X, labels)

# Predict on the words to classify
predictions = clf.predict(vectorizer.transform(words_to_classify))

# Print the results
for word, prediction in zip(words_to_classify, predictions):
    if prediction == 1:
        print(f"{word} is a bad word")
    else:
        print(f"{word} is not a bad word")
# Create the bag-of-words representation
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(bad_words + words_to_classify)

# Create labels
labels = [0] * len(words_to_classify)
for bad_word in bad_words:
    if bad_word in vectorizer.vocabulary_:
        idx = vectorizer.vocabulary_[bad_word]
        labels[idx] = 1

# Train the Naive Bayes classifier
clf = MultinomialNB()
clf.fit(X, labels)

# Predict on the words to classify
predictions = clf.predict(vectorizer.transform(words_to_classify))

# Print the resultscls
for word, prediction in zip(words_to_classify, predictions):
    if prediction == 1:
        print(f"{word} is a bad word")
    else:
        print(f"{word} is not a bad word")