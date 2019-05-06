---
layout: post
title: Monte Carlo Tree Search
---
Xin chào các bạn, đây là bài đầu tiên trong blog của mình. Trong năm 2019 này, mình có đặt ra mục tiêu có đủ 100 seminars, về bất kì chủ đề gì, nhưng chủ yếu là STEM (Science-Technology-Engineering-Mathematics) và đặc biệt là AI (Artificial Intelligence). Thật ra từ trước đây mình có viết blog nhưng rải rác, không liên tục nên nhanh chán. Mình hy vọng mục tiêu mới này sẽ làm mình thấy có trách nhiệm hơn, cảm hứng hơn. Mình sẽ cố gắng hoàn thành nó tốt nhất có thể, hãy ủng hộ mình nhé!


![_config.yml]({{ site.baseurl }}/images/kevin-oetiker-1226380-unsplash.jpg)
              _Photo by __Kevin Oetiker__ on __Unsplash__ _

Không lâu trước đây, rất nhiều ý kiến cho rằng việc một thuật toán AI có thể đạt được đến khả năng của con người, ví dụ như việc chơi cờ vây (Go) chẳng hạn, là một điều gì đó thiếu thực tế. Kể từ khi DeepBlue đánh bại được kiện tướng cờ vua thế giới Garry Kasparov năm 1996, chưa có bất kì cỗ máy cờ vây nào được ra đời đủ sức đánh bại con người, nguyên nhân đến từ độ lớn không gian mẫu của các nước đi trong môn cờ vây.

Thật bất ngờ khi vào năm 2016, AlphaGo - một cỗ máy đánh cờ vây - đã đánh bại nhà vô địch cờ vây thế giới Lee Se Dol với tỉ số 4-1. Chỉ 1 năm sau đó, AlphaGo Zero - một phiên bản nâng cấp của AlphaGo, đã đánh bại chính thế hệ trước của mình với tỉ số 100-0, điều được coi là gần như không thể đối với con người. 

AlphaGo là một chương trình máy tính được tạo nên bởi sự kết hợp của một số công nghệ, thuật toán nổi bật. Những thành phần tối quan trọng trong bộ não của AlphaGo gồm:

**1. Thuật toán Monte Carlo Tree Search.**

**2. Convolutional Neural Network (Hệ thần kinh nhân tạo chập) được dùng để đánh giá xác suất thắng của trò chơi.**

**3. Thuật toán học máy tăng cường (Reinforcement learning), được dùng cho cỗ máy chơi cờ vây với chính nó.**

Ở bài này, mình sẽ giới thiệu với các bạn thuật toán Monte Carlo Tree Search (MCTS). Đây là một thuật toán có tính ứng dụng cao trong nhiều lĩnh vực như AI, thống kê, lý thuyết trò chơi, lý thuyết kinh tế,...

Thuật toán Monte Carlo Tree Search được giới thiệu bởi [Rémi Coulom](https://en.wikipedia.org/wiki/R%C3%A9mi_Coulom) vào năm 2016, lúc đó nó là thành phần chính của [Crazy Stone](https://en.wikipedia.org/wiki/Crazy_Stone_(software)) - một thuật toán chơi cờ vây khác. Mục đích chính của Monte Carlo Tree Search (MCTS) khá đơn giản: Cho trước một trạng thái trong trò chơi, hãy dựa vào đó tìm nước đi tiếp theo để có khả năng thắng cao nhất. Lý thuyết phát triển thuật toán MCTS khá trừu tượng và phức tạp, cho nên ở đây, chúng ta sẽ sử dụng các trò chơi 2 người đơn giản để có thể quan sát, đánh giá thuật toán này, cụ thể là những trò chơi theo lượt và có hữu hạn nước đi (Finite Two Person Zero-sum Sequential Game): Cờ vây, cờ vua, cờ tướng, cờ caro,...

Trước tiên ta cần dùng một công cụ nào đó để biểu diễn trò chơi. Với nhưng PhD chuyên nghiệp, họ có thể biểu diễn một trò chơi bằng một tập các biến:
 ΓE={X,A,I,p,α,H,H,ι,ρ,u}.
 
Trông thật phức tạp và hoảng sợ phải không !? Nhưng dưới góc nhìn của một Computer Science guy, chúng ta có thể biểu diễn trò chơi dưới một cách khác, dễ quan sát hơn: một Cây Trò Chơi - Game Tree. Một cây trò chơi là một cây mà trong đó mỗi node của nó biểu diễn một trạng thái của trò chơi. Chuyển dịch từ một node đến một node con (child) của nó (nếu có) được gọi là một nước đi. Số lượng node con của một node được gọi là số rẽ nhánh (Branching factor). Node rễ của cây biểu diễn trạng thái ban đầu của trò chơi. Ta cũng có terminal node - nốt cuối - là những nốt mà không có bất cứ node con nào. Những node cuối này là trạng thái của game mà ở đó ta không thể thực hiện một nước đi nào nữa. Kết quả của trò chơi được đánh giá dựa vào các node cuối này.

![_config.yml]({{ site.baseurl }}/images/labeled-tic-tac-toe-game-tree-for-monte-carlo-tree-search.png)

Ở đây chúng ta có cây trò chơi cho game TicTacToe (cờ caro 9 ô ấy mà). Ở phần trên, chúng ta có thể thấy node rễ (Initial state) là trạng thái mà bàn cờ chưa có nước nào. Mỗi một node con của node rễ là bàn cờ đã được đi một nước, nên node rễ có 9 node con. Số rẽ nhánh phụ thuộc vào độ sâu của cây (depth). Game kết thúc ở các node cuối. Mỗi một quãng đường (traverse) đi từ node rễ đến node cuối là một ván của trò chơi. Cây trò chơi là một dạng cấu trúc dữ liệu đệ quy. Khi chọn được một nước đi tốt nhất rồi thì ta chuyển node rễ của mình xuống node con phía dưới của nó và lại bắt đầu từ đấy.

Nhưng làm sao để chọn được nước đi tốt nhất?
---

Không có một câu trả lời chính xác cho câu hỏi trên. Lý do lớn nhất là vì ta không thể biết trước được nước đi của đối phương. Đó có thể là một cao thủ với trình độ và kỹ năng cao nhưng cũng có thể chỉ là một anh bạn noob mới chơi. Nếu bạn thực sự không biết gì về trình độ của đối phương, có một chiến thuật gọi là **minimax** giúp bạn đi được nước đi tốt nhất sau khi đối phương đã đi (giả sử nước đi của đối phương cũng là nước đi tốt nhất có thể của anh/chị ấy). Thuật toán **minimax** có thể được mô tả qua công thức đệ quy sau: 

![_config.yml]({{ site.baseurl }}/images/formulaMINIMAX.png)

* _vA_ and _vB_ là 2 hàm "lợi ích" của 2 người chơi là A và B.
* **move** là hàm số có đầu ra là trạng thái tiếp theo của trò chơi (chọn ra node con tiếp theo trở thành node rễ) nếu biết trạng thái hiện tại _si_ và hành động tại trạng thái đó _ai_ 
* **eval** là hàm số đánh giá kết quả của trò chơi (tại node cuối)
* **_s^_** là một trạng thái cuối cùng bất kì (ở node cuối)
* dấu trừ ở _vB_ thể hiện rằng đây là một trò chơi zero-sum, tức là trạng thái của 2 người chơi tại cùng thời điểm luôn là đối ngược nhau.
Nói một cách đơn giản, cho trước trạng thái **_s_**, bạn muốn tìm một nước đi **_ai_** tạo ra cho mình khả năng thắng cao nhất (giả sử rằng đối phương cũng đang làm như vậy, tức anh ta có những nước đi để làm giảm khả năng thắng của bạn nhất). Đây là nguồn gốc của cái tên **minimax**. Việc tiếp theo cần làm là mở rộng toàn bộ cây trò chơi và gửi kết quả đánh giá các node cuối cùng ngược trở lại trạng thái ban đầu (node rễ) để có thể quyết định nước đi tiếp theo. 

![_config.yml]({{ site.baseurl }}/images/chess-mcts.png)

Cây trò chơi ở phía trên mô tả các chọn nước đi tốt nhất trong trò cờ vua.
Nhược điểm lớn nhất của thuật toán **minimax** là việc mở rộng cây trò chơi. Đối với những trò chơi có chỉ số rẽ nhánh cao (cờ vây hoặc cờ vua chẳng hạn), việc mở rộng cây trò chơi có thẻ trở nên vô cùng phức tạp và có độ tính toán rất lớn.

Có vài phương án giải quyết được đặt ra, một trong số ấy là chỉ mở rộng cây trò chơi tới một độ sâu (depth) nhất định (thresold). Nhưng kể cả thế thì trong rất nhiều trường hợp, ta không thể khẳng định được node mà ta đánh giá tại độ sâu đó có phải node cuối hay không. Vì vậy ta cần một hàm số có thể đánh giá kết quả cuối cùng một trò chơi mà không cần đến node cuối của cây. Điều này thì khá là tự nhiên với con người, chúng ta có thể nhìn vào thế trận hiện tại trên bàn cờ để dự đoán ai sẽ là người chiến thắng (một bên còn tướng, hậu, xe, mã và một bên chỉ còn tướng và 1 tốt chẳng hạn). 

Một cách khác nữa là sử dụng thuật toán [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning), nó giúp ta mở rộng cây trò chơi mà có thể bỏ qua nhiều nhánh rẽ. Bạn đọc có thể xem giới thiệu khái quát về **alpha-beta** tại [đây](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-034-artificial-intelligence-fall-2010/lecture-videos/lecture-6-search-games-minimax-and-alpha-beta/).

Monte Carlo Tree Search - những khái niệm cơ bản.
---

Đối với thuật toán Monte Carlo Tree Search, cách tính nước đi khả quan nhất được thực hiện khác so với **minimax**.
MCTS sẽ giả lập trò chơi nhiều lần rồi dự đoán nước đi khả quan nhất dựa trên những lần giả lập đó.

Phần quan trọng nhất của MCTS chính là phần S: **Search**. Search là một tập bao gồm các "quãng đường" trong khắp cây trò chơi từ trên xuống dưới. Một "quãng đường" là một cách di chuyển từ node rễ (trạng thái game hiện tại) đến một node mà chưa được mở rộng hoàn toàn(**not fully expanded**). Một node được gọi là chưa mở rộng hoàn toàn khi có ít nhất một node con của nó chưa được khám phá, đi đến (**visited**). Khi một **not fully expanded** node được tìm thấy, node con **unvisited** của nó sẽ được chọn để làm node rễ cho một lần chơi giả lập. Kết quả của lần giả lập đó sẽ được truyền ngược lại về node rễ thật (trạng thái hiện tại). Khi quá trình search kết thúc, nước đi tiếp theo sẽ được chọn dựa trên kết quả trả về của nhiều lần giả lập trước đó.

**Giải thích**: Giả lập ở đây có nghĩa là một ván của trò chơi, gồm một loạt các nước đi liên tiếp theo lượt, bắt đầu từ node hiện tại (trạng thái của trò chơi) và kết thúc ở một node cuối nơi mà kết quả của trò chơi được đánh giá.

Nhưng các nước đi trong mỗi lần giả lập được chọn ra sao? Trên thực tế, các nước đi được thực hiện bởi một hàm số tên là **Rollout Policy**. Đầu vào của nó là một trạng thái của trò chơi còn đầu ra là nước đi tiếp theo cho trạng thái đó. Dĩ nhiên, các nước đi bắt buộc phải tuân theo luật của trò chơi, nhưng cách mà chúng được chọn thì rất ngẫu nhiên. Hàm ngẫu nhiên này thường là uniform random - phân phối đều. 

![_config.yml]({{ site.baseurl }}/images/simulation.png)

Ở dạng đơn giản nhất, giả lập là tập các nước đi ngẫu nhiên liên tiếp bắt đầu từ một node rễ và kết thúc ở một nốt cuối. Giả lập luôn kết thúc với một kết quả đánh giá, ví dụ là thắng, thua, hòa (cờ vua, cờ vây,...) hoặc một chỉ số nào đó.

Khi một giả lập bắt đầu ở một node nào đó, node đó được gọi là **visited**. Nhớ là chỉ khi nó là node rễ của một giả lập thì mới là **visited** nhé. Các node được chọn bởi **Rollout Policy** thì không được tính là **visited** đâu.

Backpropagation - Truyền kết quả ngược lại
---
Sau khi mỗi giả lập kết thúc, kết quả được gửi trở về node rễ ban đầu (node trạng thái hiện tại của trò chơi, nó là node cha của node rễ của giả lập). Các kết quả được thu về để thực hiện tính toán. Cụ thể ta có 2 giá trị sau:
* **_Q(v)_**: **Chỉ số giả lập khả quan** (**Total Simulation Reward** - mình dịch thoát, thông cảm), là một thuộc tính của của node **_v_**, là tổng của tất cả các kết quả của những lần giả lập mà **đi qua** node đó, không nhất thiết phải là node rễ của giả lập nhé.
* **_N(v)_**: Chỉ số visit, là số lần mà các con đường **backpropagation** đi qua node đó (tức là nó đóng góp bao nhiêu lần cho cho chỉ số giả lập khả quan).

Mỗi node đều có 2 giá trị này, nếu nhìn vào một node, ta có thể biết được mức độ chiến thắng nếu đi qua node đó. (**Q(v)** cao hoặc **N(v)** thấp).

Khi một quá trình search bắt đầu, do chưa có bất kì giả lập nào được thực hiện nên **unvisited** node sẽ được bắt đầu đầu tiên. 

![_config.yml]({{ site.baseurl }}/images/uct.png) 

Nhìn vào hình trên, ta thấy node màu xanh dương là node rễ, đã mở rộng hoàn toàn (**fully expanded**) bởi các node con của nó đều đã được đi qua (**visited**) - tức là node rễ của 1 giả lập. Vậy làm sao ta có thể chọn một node trong số các node con này làm nước di chuyển tiếp theo? Câu trả lời chính là **UCT (Upper Confidence bound applied for Tree)**, một đại lượng quan trọng để quyết định node nào sẽ được sử dụng để chọn nước đi tiếp theo. Đây chính làm hàm số quan trọng, cốt lõi của **MCTS**. Nó có công thức như sau: 

![_config.yml]({{ site.baseurl }}/images/uctformula.png)

Node được chọn để làm nước đi tiếp theo cho MCTS chính là node **_Vi_** có chỉ số **UCT** cao nhất. Hàm số này gồm có 2 thành phần.Thành phần thứ nhất, **Q(vi)/N(vi)** được gọi là **exploitation component** - chỉ số khai thác (mình dịch thoát, thông cảm nhé) - có thể được hiểu như là tỉ lệ **thắng/thua**. Tử số càng cao và mẫu số càng bé thì chỉ cố này càng lớn (tất cả đều dương nhé). Chỉ số này có vẻ rất quan trọng và hiển nhiên để quyết định một node có được chọn hay không, nhưng tại sao ta không chỉ dùng mỗi nó? Bởi vì ta rất có thể sẽ rơi vào trường hợp của thuật toán tham lam, tức là quá thiên vị những kết quả tốt nhất đầu tiên. cần nhớ lại là các nước đi ngẫu nhiên trong mỗi giả lập được thực hiện bởi hàm số **Rollout Policy**, và hàm số này là một hàm số ngẫu nhiên, nên những kết quả tốt nhất đầu tiên chưa chắc (dù có khả năng cao hơn chút) đã là những nước đi tốt nhất. Cụ thể hơn, ngay trong lần giả lập đầu tiên, node con nào là nước đi để dành chiến thắng sẽ được thiên vị, những node con khác kém may mắn hơn sẽ bị loại ngay mà không có cơ hội cải thiện chỉ số ở những lần giả lập tiếp theo.

Đó là lý do tại sao chúng ta có thêm một đại lượng phía sau, gọi là **exploration component** - chỉ số tiềm năng. Nhìn vào công thức và quan sát, ta thấy rằng đại lượng tiềm năng "ưa" những node mà có số lần được giả lập đi qua ít hơn. Bảng dưới đây cho ta cái nhìn nhanh về đại lượng này.

![_config.yml]({{ site.baseurl }}/images/exploration-uct.png)

Đại lượng **c** có trong phần **exploration** là một tham số dùng để cân bằng 2 đại lượng **exploitation** và **exploration**.

Khi nào thuật toán Monte Carlo Tree Search kết thúc?
---
Câu trả lời là: còn tùy! Nếu bạn muốn tạo một thuật toán thi đấu game, rõ ràng có thời gian giới hạn cho việc suy nghĩ nước đi nên bạn sẽ bị giới hạn trong một thời gian nhất định. Ngoài ra, tài nguyên tính toán của bạn cũng ảnh hưởng đáng kể, an toàn nhất là nên giới hạn trong khả năng, cấu hình của máy tính.

Thực tế cho thấy, khi kết thúc **MCTS**, những node được chọn thường là những node có chỉ số **exploration** cao nhất. Điều này cũng dễ hiểu bởi nếu nó quan trọng và có khả năng thắng cao, nó sẽ thường được đi qua nhiều hơn cả. Sau khi đi một nước, tức chuyển node rễ ban đầu xuống một node con của chính nó, ta lại bắt đầu một trạng thái trò chơi mới, và thay vì chạy **MCTS** lại từ đầu, ta có thể sử dụng các chỉ số đã chạy từ lần trước đó để quyết định nước đi.

Trên đây là những gì hay ho nhất đã tạo nên **Alpha Go/Zero**. Bài này hoàn toàn do mình dịch lại, link bài gốc gồm nội dung và ảnh ở phía dưới. Cảm ơn các bạn đã đọc đến dòng cuối cùng này. Mình biết bài dịch của mình vẫn còn nhiều khuyết điểm, rất mong được các bạn góp ý (một cách lịch sự nhé!). Xin chào và hẹn gặp lại.


**Bài gốc tại [int8](https://int8.io/monte-carlo-tree-search-beginners-guide/)**


















