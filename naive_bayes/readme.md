```py
py -m pip install scikit-learn
Collecting scikit-learn
  Downloading scikit_learn-1.4.1.post1-cp311-cp311-win_amd64.whl (10.6 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 10.6/10.6 MB 6.3 MB/s eta 0:00:00
Collecting numpy<2.0,>=1.19.5
  Downloading numpy-1.26.4-cp311-cp311-win_amd64.whl (15.8 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 15.8/15.8 MB 4.1 MB/s eta 0:00:00
Collecting scipy>=1.6.0
  Downloading scipy-1.12.0-cp311-cp311-win_amd64.whl (46.2 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 46.2/46.2 MB 5.1 MB/s eta 0:00:00
Collecting joblib>=1.2.0
  Downloading joblib-1.3.2-py3-none-any.whl (302 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 302.2/302.2 kB 6.3 MB/s eta 0:00:00
Collecting threadpoolctl>=2.0.0
  Downloading threadpoolctl-3.4.0-py3-none-any.whl (17 kB)
Installing collected packages: threadpoolctl, numpy, joblib, scipy, scikit-learn
```


### Result 

```py
Classification Report:
               precision    recall  f1-score   support

           0       0.00      0.00      0.00       1.0
           1       0.00      0.00      0.00       1.0

    accuracy                           0.00       2.0
   macro avg       0.00      0.00      0.00       2.0
weighted avg       0.00      0.00      0.00       2.0
```