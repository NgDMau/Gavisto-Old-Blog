---
layout: post
title: FAT và NTFS là gì và chúng khác nhau ra sao?
---


Khi lắp đặt thêm 1 ổ cứng mới hoặc cài đặt lại Windows, hệ điều hành sẽ hỏi bạn có muốn format lại ổ đĩa không (format - định dạng ổ cứng là quá trình đưa ổ cứng của bạn về dạng nguyên thủy nhất tức là xóa toàn bộ thông tin trên ổ cứng). Thông thường sẽ có 2 định dạng cho bạn lựa chọn: NTFS và FAT32. Chúng có nghĩa là gì? Biết phải chọn cái nào bây giờ? 

**FAT là gì?**

FAT32 (File Allocation Table 32) là tên một hệ thống lưu trữ cho các thiết bị điện tử như ổ cứng, SSD, RAM, thẻ nhớ,... được tạo ra năm 1977 bởi Microsoft cho hệ điều hành MS-DOS. 

Ta có thể coi FAT là 1 bảng nối những cluster (đơn vị nhớ cơ bản nhất trên ổ cứng ở level hệ điều hành) với sector (một dạng đánh dấu địa chỉ của phần cứng máy tính).

Trước hết, ổ cứng được chia thành những thành phần cơ bản nhỏ nhất, gọi là các cluster. Một file có thể sử dụng một hoặc nhiều cluster để lưu trữ nội dung của file đó, nội dung càng nhiều thì càng dùng nhiều cluster. Khi một file mới cần lưu trữ, cluster đầu tiên đang avalable sẽ được cấp cho file đó. Nếu file cần nhiều cluster, mỗi cluster cũng sẽ chứa địa chỉ đến cluster tiếp theo được file sử dụng (đây chính là một dạng linked list, xem thêm về linked list tại [đây](https://www.geeksforgeeks.org/data-structures/linked-list/)). Nếu một cluster là cluster cuối cùng được file sử dụng, thay vì chứa một địa chỉ đến cluster tiếp theo, nó sẽ chứa giá trị 0xFFFF để báo hiệu sự kết thúc của một file).

Bảng FAT chứa 4 loại thông tin về các cluster:

- Unused (vị trí chưa được sử dụng)
- Cluster in use by a file (đang được một file nào đó sử dụng)
- Bad cluster (lỗi lưu trữ)
- Last cluster in a file (cluster cuối cùng được sử dụng bởi mộ file)

![_config.yml]({{ site.baseurl }}/images/recover-FAT-structure.gif)



Nhìn hình minh họa ở phía trên, ta thấy FILE1.txt sử dụng 3 cluster. Đầu tiên là cluster số 2 (là 0002 đó), ở cluster số 2 cũng chứa địa chỉ 0003, tức cluster tiếp theo được FILE.txt sử dụng là cluster số 3. Cluster số 3 cũng trỏ tới địa chỉ 0004 tức cluster số 4. Tại cluster số 4 chứa FFFF báo hiệu nó là cluster cuối cùng mà FILE1.txt sử dụng. Xét FILE2.txt sử dụng địa chỉ 0005 làm cluster đầu tiên, sau đó cluster 0005 lại trỏ đến cluster 0006, cluster 0006 lại trở đến cluter 0008 và tại đây ta thấy FFFF, báo hiệu rằng cluster số 8 này chính là cluster cuối cùng mà FILE2.txt sử dụng. Tương tự, FILE3.txt chỉ sử dụng duy nhất cluster 0007. (Lưu ý rằng mỗi cluster KHÔNG CHỈ chứa địa chỉ của cluster khác mà còn chứa toàn bộ hoặc một phần nội dung của file, trên hình minh họa không nhắc đến).

Số 32 ở phía sau có nghĩa rằng 32 bit được sử dụng để đánh dấu địa chỉ file. Số này càng lớn có nghĩa hệ thống càng hỗ trợ bộ nhớ dung lượng cao. Ngoài FAT32 ta còn có FAT16, FAT12 và FAT8 tuy nhiên chúng hầu như không còn hoặc ít được sử dụng.


**NTFS là gì?**

NT File System (đôi khi được dịch là New Technology File System) là hệ thống lưu trữ file được Windows NT sử dụng. So với FAT32, NTFS có khá nhiều cải tiến ở cả hiệu năng, độ ổn định và sự an toàn. Khác với FAT32 nơi các clusters được tổ chức ở dạng linked-list, NTFS xắp xếp file theo dạng B-tree (một dạng cây dữ liệu mà số lượng node con mỗi node cha có thể có bằng với độ sâu của cây, ý nghĩa của từ B cho đến nay chưa được giải thích rõ ràng).

![_config.yml]({{ site.baseurl }}/images/b-tree.gif)

So sánh với một cây nhị phân ở bên trái của hình bên, một B-tree có lợi thế là dễ truy cập đến các node con do mỗi node có nhiều node con hơn. Ví dụ node màu đỏ ở cây nhị phân thì mang bậc 4, còn ở B-tree mang bậc 3. Trade-off ở đây vẫn tồn tại, đó là việc xử lý các truy cập ở mỗi node sẽ phức tạp hơn do chúng có nhiều node con hơn so với cây nhị phân.

Một hệ thống NTFS sẽ bao gồm 4 phần:

- Partition boot sector
- Master File Table
- System files
- File area

 NTFS sử dụng bảng quản lý tập tin MFT (Master File Table) thay cho bảng FAT quen thuộc nhằm tăng cường khả năng lưu trữ, tính bảo mật cho tập tin và thư mục, khả năng mã hóa dữ liệu đến từng tập tin. Ngoài ra, NTFS có khả năng chịu lỗi cao, cho phép người dùng đóng một ứng dụng “chết” (not responding) mà không làm ảnh hưởng đến những ứng dụng khác. Tuy nhiên, NTFS lại không thích hợp với những ổ đĩa có dung lượng thấp (dưới 400 MB) và không sử dụng được trên đĩa mềm.

 Khi định dạng một ổ cứng về NTFS, chương trình định dạng sẽ dành 16 sectors đầu tiên để lưu trữ Boot-metadata-file. Sector đầu tiên chứa "bootstrap" code và 15 sectors tiếp theo chứa IPL (Initial Program Loader). Dữ liệu trong nhưng sector này giúp cho Ntldr (NT loader program) tìm thấy MFT (Master File Table) trong quá trình khởi động. Trên phân vùng NTFS, vị trí của MFT rất linh hoạt, có thể thay đổi được trong trường hợp các sector chứa nó bị lỗi. Tuy nhiên nếu bản thân data bị lỗi thì MFT không thể được locate, lúc đó Windows sẽ nhận nhầm rằng phân vùng bộ nhớ chưa hề được định dạng.

 Boot sector vô cùng quan trọng bởi hệ thống cần nó để truy cập bộ nhớ chứa toàn bộ dữ liệu. Do đó để đảm bảo an toàn, nên scan ổ đĩa định kỳ bằng công cụ Chkdsk cũng như backup dữ liệu trong trường hợp không thể truy cập phân vùng nhớ.

 Mỗi một file trong phân vùng NTFS được biểu diễn bởi một bản ghi (record) ở trong 1 file đặc biệt, gọi là Master File Table (MFT). NTFS để dành 16 bản ghi đầu tiên để lưu trữ những thông tin đặc biệt.

 Record đầu tiên của bảng (tức là MFT ấy) dùng để lưu trữ chính thông tin về bảng đó. Những thông tin ấy tiếp tục được lưu trong sector tiếp theo. Trong trường hợp sector đầu tiên bị lỗi, hệ thống sẽ đọc sector tiếp theo để lấy thông tin.

 ![_config.yml]({{ site.baseurl }}/images/NTFS-MFT-structure.gif)

 Hình trên minh họa một cấu trúc MFT đơn giản.

 MFT dùng một lượng không gian nhất định cho mỗi record. Những đặc tính của file được ghi lại ngay trong vùng bộ nhớ được cấp phát trong MFT. Những file hoặc thư mục nhỏ (thường là dưới 512 bytes) có thể hoàn toàn được chứa trong một record của MFT.

 ![_config.yml]({{ site.baseurl }}/images/NTFS-MFT-small-file-struture.gif)

 Hình trên mô tả một file nhỏ được lưu ngay trong record của MFT. Nhớ rằng nếu sử dụng FAT, trước hết hệ thống sẽ kiểm tra file allocation để check nó có tồn tại hay không (tức là tìm sector đầu tiên) sau đó sẽ dựa vào đó để tìm các sector tiếp theo của file. Đối với NTFS, file đã ở sẵn trong record khi bạn tìm.

 Tương tự, thư mục cũng giống thế, chỉ khác chúng không chứa data mà chứa các index (chỉ số) của các file hoặc thư mục con bên trong nó.

 Nếu directory quá lớn, thay vì được chứa ngay trong MFT, nó sẽ được tổ chức dưới dạng B-tree.

 **Tổng kết**

 FAT là một định dạng đã cũ và ngày nay rất còn ít được sử dụng cho dù rất nhiều thiết bị vẫn có khả năng đọc/ghi phân vùng FAT. Nó không thể chứa những tập tin lớn hơn 4GB cũng như có độ an toàn thông tin thấp.

 NTFS là định dạng hiện đại hơn. Khi cài đặt Windows thì mặc định ổ đĩa cài Windows của bạn sẽ là NTFS. Dù có nhiều tính năng hiện đại, nhưng điểm trừ của NTFS đó là sự hỗ trợ khá hạn chế từ các nền tảng. NTFS tương thích với hầu hết các phiên bản gần đây của Windows, kể cả Windows XP. Song với một số hệ điều hành khác thì NTFS lại khá "khó chịu". Như Mac OS X chỉ có thể đọc chứ không thể ghi nội dung lên phân vùng NTFS. Hay một số phiên bản Linux có hỗ trợ ghi dữ liệu lên phân vùng NTFS, nhưng một số khác thì không. Một số thiết bị phần cứng khác như máy chơi game PlayStation cũng không hỗ trợ, trong khi Xbox 360 của chính Microsoft cũng không tương thích với NTFS, chỉ hệ máy Xbox One mới hơn lại tương thích.


 Tham khảo tại [ntfs.com](http://www.ntfs.com/ntfs_basics.htm) và [vnreview.vn](https://vnreview.vn/tu-van-may-tinh/-/view_content/content/1715965/phan-biet-cac-dinh-dang-ntfs-fat32-va-exfat)











