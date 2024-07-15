from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# Dữ liệu mẫu (từ xấu)
data = {
    "hồ chí mi": 1,
    "cục phó": 1,
    "cục văn hóa": 1,
    # Nhiều từ khác ở đây...
    "uỷ viên": 1,
    "gay lol": 1,
    "đại hội đại biểu toàn quốc mttqvn": 1
}

# Tạo dữ liệu huấn luyện từ danh sách từ xấu
texts = list(data.keys())
labels = list(data.values())

# Tạo mô hình Naive Bayes
model = make_pipeline(CountVectorizer(vocabulary=texts), MultinomialNB())

# Mô hình không cần huấn luyện vì chúng ta sẽ sử dụng danh sách từ xấu làm từ điển

# Kiểm tra câu
test_data = [
    "chủ tịch Hồ Chí Minh",
    "ỉ bậy",
    "Hồ Chí Minh là vị lãnh tụ của Việt Nam",
    "Pornhub là một trang web nổi tiếng",
    "dâm quá đi",
    "hello world"
]

predicted_labels = model.predict(test_data)

for sentence, label in zip(test_data, predicted_labels):
    if label == 1:
        print(f"Câu '{sentence}' có chứa từ xấu.")
    else:
        print(f"Câu '{sentence}' không chứa từ xấu.")
