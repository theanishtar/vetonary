from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Sample text data
text_data = [
    "This is a positive review. I really enjoyed the product.",
    "I didn't like the product at all. It was a waste of money.",
    "The product met my expectations. Overall, a good experience.",
    "Terrible service and poor quality. I would not recommend this.",
    "I am very satisfied with the product. It exceeded my expectations.",
    "This is the worst purchase I've ever made. Avoid it!",
]

# Labels (0 for negative, 1 for positive)
labels = [1, 0, 1, 0, 1, 0]

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(text_data, labels, test_size=0.2, random_state=42)

# Create the bag-of-words representation
vectorizer = CountVectorizer()
X_train_vectorized = vectorizer.fit_transform(X_train)
X_test_vectorized = vectorizer.transform(X_test)

# Train the Naive Bayes classifier
clf = MultinomialNB()
clf.fit(X_train_vectorized, y_train)

# Evaluate the classifier on test data
y_pred = clf.predict(X_test_vectorized)
print("Classification Report:\n", classification_report(y_test, y_pred))