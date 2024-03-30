from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split

# Sample data
data = {
    "hồ chí mi": 1,
    "chủ tịch Hồ Chí Minh": 0,
    "cục phó": 1,
    "cục văn hóa": 1,
    "hoang loạn": 1,
    "đồ ngốk": 1,
    "háu gái": 1,
    "khôn ngoan": 0,
    "ỉa": 1,
    "tâm dâm": 1,
    "hên vl": 1,
    "hello": 0,  # Add some non-bad words for training
    "world": 0,
    "python": 0
}

# Create lists for text data and labels
text_data = list(data.keys())
labels = list(data.values())

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(text_data, labels, test_size=0.2, random_state=42)

# Create the bag-of-words representation
vectorizer = CountVectorizer()
X_train_vectorized = vectorizer.fit_transform(X_train)
X_test_vectorized = vectorizer.transform(X_test)

# Train the Naive Bayes classifier
clf = MultinomialNB()
clf.fit(X_train_vectorized, y_train)

# Test the classifier
test_words = ["hello", "cục phó", "world", "ỉa", "mắc ỉa", "cút xéo", "Mắc ỉaaaaaa quá", "cúttttttttt", "hồ chí minh"]
test_data_vectorized = vectorizer.transform(test_words)
predictions = clf.predict(test_data_vectorized)

for word, prediction in zip(test_words, predictions):
    print(f"Word: {word}, Prediction: {'Bad word' if prediction == 1 else 'Not a bad word'}")