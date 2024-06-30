FROM ubuntu:20.04

RUN apt-get update && apt-get install -y vsftpd;

RUN useradd -m ftpuser && echo "ftpuser:ftppassword" | chpasswd

RUN	mkdir -p /home/ftpuser/ftp/files
RUN chown nobody:nogroup /home/ftpuser/ftp
RUN chmod a-w /home/ftpuser/ftp
RUN chown ftpuser:ftpuser /home/ftpuser/ftp/files

COPY vsftpd.conf /etc/vsftpd.conf

EXPOSE 20 21 21100-21110

CMD ["/usr/sbin/vsftd", "/etc/vsftpd.conf"]

