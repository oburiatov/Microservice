
   
FROM centos:7

RUN yum install -y epel-release

RUN yum update -y \
&& yum install -y \
ca-certificates \
curl \
jq \
git \
iputils \
libcurl \
libicu \
libunwind \
netcat \ 
openssl

RUN curl -fsSL https://get.docker.com/ | sh

#RUN systemctl start docker
RUN systemctl enable docker


WORKDIR /azp
COPY ./start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]