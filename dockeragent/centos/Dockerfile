
   
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

RUN yum install -y yum-utils
RUN yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
RUN yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin


#RUN systemctl start docker
RUN systemctl enable docker


WORKDIR /azp
COPY ./start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]