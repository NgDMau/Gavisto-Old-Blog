---
layout: post
title: Art of Vector Representation of Words
---

Việc sáng tạo ra các ngôn ngữ để diễn đạt tâm tư, ý nghĩ về một sự vật, sự việc nào đó là một bước đột phát lớn trong lịch sử loài người. Nó là tiền đề cho tiến hóa vượt bậc của nhân loại sau này. Tuy nhiên trên thực tế, dù đã trải qua hàng ngàn năm phát triển, vẫn có nhiều trường hợp các ngôn ngữ trở nên không rõ ràng, khó diễn đạt. Ta có ví dụ sau trong tiếng Anh:

    _"Việt rất yêu bạn gái anh ấy, Nam cũng thế"._

Rốt cuộc Nam yêu bạn gái mình hay bạn gái của Việt? Ở đây ta bắt gặp sự khó hiểu ở cách diễn đạt ngôn ngữ, ngay cả với trình độ của một người trưởng thành. Câu hỏi được đặt ra là làm sao để biểu diễn ngôn ngữ của con người ở một mức độ để máy tính có thể hiểu được?

Trong bài này, chúng ta sẽ đi tìm hiểu các phương pháp biểu diễn ngôn ngữ của con người dưới dạng mà máy tính có thể hiểu được, cùng với đó là ưu nhược điểm của từng loại phương pháp. Bài viết khá dài và có xuất hiện các công thức toán, nhưng không hề phức tạp đâu, mình đảm bảo!

Chúng ta đều biết ngôn ngữ của máy tính là những con số, trong khi của con người là tổ hợp của nhũng ký tự chữ cái. Chính vì vậy, phải có một cách chuyển đổi nào đó để đưa những ký tự chữ cái về các con số (hoặc một tập các con số). Những cách chuyển đổi như vậy được gọi là vector-hóa (vectorization).Ta sẽ lần lượt khám phá các phương pháp vectorization từ cổ điển nhất đến nâng cao nhất:

**1. Biểu diễn one-hot (One-hot representations)**
**2. Biểu diễn rời rạc (Distributed representations)**
**3. Phân tích giá trị suy biến (Singular Value Decomposition)**
**4. Mô hình CBOW (Continous Big of Words)**
**5. Mô hình Skip-gram (Skip-gram model)**
**6. Biểu diễn Glove (Glove representations)**

**One-hot representation**
Cho trước một tập từ vựng gồm V từ, có thứ tự (V là số tự nhiên)/ Lấy ví dụ tập A = [human, machine, interface, if, computer, applications, opinion, system, learn, science, time] gồm 11 từ, khi đó từ "interface" sẽ được biểu diễn dưới dạng vector [0 0 1 0 0 0 0 0 0 0 0]. Một vector gồm V-1 giá trị 0 và chỉ giá trị 1 duy nhất tại vị trí tương ứng với vị trí của nó trong tập từ, rất đơn giản đúng không? Tuy nhiên cái đơn giản này lại dẫn đến sự phức tạp, khi mà tập từ vựng quá lớn thì mỗi vector dài bằng với độ dài của tập từ, việc này khiến cho quá trình tính toán tốn rất nhiều tài nguyên. Hơn nữa việc chỉ có một giá trị duy nhất khác 0 khiến cho sử dụng các hàm similarity trở nên khó khăn. Ta gần như không lấy được thông tin gì nếu chỉ dùng những vector dạng này.

**Distributed representations**
Ý tưởng của phương pháp này dựa trên khái niệm "co-occurence". Ta tính số lần một từ xuất hiện trong cùng một ngữ cảnh với từ khác, với các ngữ cảnh gần nhau một khoảng k (k là số tự nhiên).

Lấy ví dụ đoạn văn bản sau:

_"Human machine interface for computer applications"_
_"User opinion of computer system response time"_
_"User interface management system"_
_"System engineering for improved response time"_

Ta có ma trận co-occurence như sau:

![_config.yml]({{ site.baseurl }}/images/coocurence.png)

Từ "system" có mặt ở trong 2 ngữ cảnh (và 2 ngữ cảnh này cạnh nhau, nếu giữa chúng có 2 ngữ cảnh khác thì k = 3 và một trong 2 phải bị loại) với từ "user" nên giá trị tại [system][user] = [user][system] = 2. Mỗi hàng (hoặc cột) trong ma trận trên sẽ là vector tương ứng với mỗi từ đầu hàng hoặc đầu cột đó.
Tuy nhiên một điều cần lưu ý là có những từ lặp lại với số lần không nhỏ nhưng mang ít ý nghĩa, ví dụ: for, of,... Từ đây ta lại sinh ra khái niệm Positive Pointwise Mutual Information (PPMI). PPMI sẽ giúp ta quan tâm đến việc một từ xuất hiện trong cùng một ngữ cảnh với từ khác có quá quan trọng hay không.

![_config.yml]({{ site.baseurl }}/images/ppmi.png)

![_config.yml]({{ site.baseurl }}/images/ppmi_cal.png)

![_config.yml]({{ site.baseurl }}/images/matrix_ppmi.png)
    _Ma trận mới sau khi sử dụng PPMI_

Từ đây chúng ta đã có bước đầu mang ngữ cảnh vào vector, một thông tin thú vị, tuy nhiên chưa thật sự tối ưu. Ví dụ từ "cat" và "dog" nằm ở các ngữ cảnh quá xa nhau (lớn hơn k) thì độ liên quan của chúng dĩ nhiên sẽ giảm bớt. Hơn nữa, ta vẫn chưa giảm được số chiều của một vector nên khối lượng tính toán vẫn rất nặng nề. 

**Singular Value Decomposition**
Ở 2 phương pháp trên, ta thấy nhược điểm rất lớn của chúng là số chiều dữ liệu quá lớn gây khó khăn cho việc tính toán. SVD được ra đời để khắc phục yếu điểm đó. Cơ chế của SVD là phân tích một ma trận thành tích của nhiều ma trận đặc biệt.
Giả sử ta có ma trận dữ liệu A với số chiều là m*n, khi đó A có thể được phân tích như sau:

![_config.yml]({{ site.baseurl }}/images/svdmatrix.png)

2 ma trận ở 2 bên là ma trận trực giao, ma trận ở giữa là ma trận đường chéo. Trong đó, theo thứ tự, **u1**, **v1**, **σ1** chứa những thông tin quan trọng nhất, rồi đến **u2**, **v2**, **σ2** và cứ thế đến **uk**, **vk**, **σk**. Vì vậy nếu muốn lấy **t** dữ liệu quan trọng, ta lấy từ **u1**, **v1**, **σ1** đến **ut**, **vt**, **σt**.

**Tham khảo thêm tại [Machine Learning cơ bản](https://machinelearningcoban.com/2017/06/07/svd/)**

Chúng ta có thể hình dung phương pháp SVD giống như việc dùng số bit để hiển thị màu. Thông thường một hệ 8-bit sẽ được sử dụng để mã hóa các màu sắc. Xét ảnh dưới đây:

![_config.yml]({{ site.baseurl }}/images/color8bit.png)

Nếu phải giảm số bit về 4 (thay vì 8) thì chúng ta sẽ giữ lại 4 bits nào? Một ý nghĩ hiện ra ngay, là ta giữ lại 4 bits cuối cùng, vì khi đó ta không cần phân biệt các màu theo độ đậm nhạt nữa. Xanh lá nhạt hay xanh lá đậm thì vẫn là màu xanh lá thôi!

**Continuous Bag of Words (CBOW)**
Các phương pháp vừa giới thiệu xong đều sử dụng thống kê cổ điển để tạo ra vector biểu diễn của từ, phương pháp CBOW này sử dụng cơ chế mới hoàn toàn. Xét bài toán sau: Từ một tập dữ liệu văn bản (corpus) cho trước, nếu được cho dãy gồm n-1 từ (các từ phải có trong tập dữ liệu trên), hãy dự đoán từ thứ n trong dãy?

Đến đây chúng ta vẫn có một thắc mắc, rằng bài toán trên thì có liên quan gì đến việc tìm ra các vector biểu diễn từ ngữ nhỉ?
Cứ bình tĩnh! Trước hết, chúng ta sẽ sử dụng một neural network cho bài toán kia đã:

![_config.yml]({{ site.baseurl }}/images/neuralnet.png)

   _Trong hình trên, đầu vào là một vector dạng one-hot của từ "sat", đầu ra là xác suất của các từ sẽ đứng sau nó_

Thế thì liên quan gì đến các vector biểu diễn? Giờ hãy nhìn vào các phép toán bên trong neural network của chúng ta nhé: Tích **W**_context_***x** với **x** là một one-hot vector.

![_config.yml]({{ site.baseurl }}/images/product.png)

**P(on|sat)** tỉ lệ với dot product giữa cột thứ _j_ của **W**_context_ và cột thứ _i_ của **W**_word_. Từ đó, ta sẽ lấy cột thứ _i_ của **W**_word_ là vector biểu diễn của từ thứ _i_. Những tham số trong neural network mà ta cập nhật mỗi lần chính là vector biểu diễn của các từ trong tập dữ liệu.

Các mô hình neural network kiểu này được gọi là feed-forward, cách học của chúng khá phổ biến nên mình sẽ không nhắc ở đây nữa. Các bạn có thể tham khảo thêm tại **[đây](https://towardsdatascience.com/deep-learning-feedforward-neural-network-26a6705dbdc7)**

**Tham khảo thêm về CBOW tại [đây](https://www.kdnuggets.com/2018/04/implementing-deep-learning-methods-feature-engineering-text-data-cbow.html)**


**Skip-Gram Model**
Mô hình này có thể giải thích như là ngược lại của **CBOW**: Cho một tập dữ liệu văn bản, với mỗi từ cho trước, hãy dự đoán các từ có thể đi cùng nó (gọi là cùng context/ngữ cảnh)

![_config.yml]({{ site.baseurl }}/images/skipgram.png)

_Cho trước từ "on", mô hình cần dự đoán được các từ có thể đi cùng nó "he", "sat", "a", "chair"_

Ta train một mạng neural để dự đoán một/nhiều từ xuất hiện dựa trên nhiều/một từ cho trước, nhưng sau đó ta không cần cái mạng neuron đó nữa mà chỉ lấy các tham số ở hidden layer. 

**Tham khảo thêm về Skipgram tại [đây](https://www.kdnuggets.com/2018/04/implementing-deep-learning-methods-feature-engineering-text-data-skip-gram.html)**

**GloVe Representations**





