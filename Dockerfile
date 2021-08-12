FROM adoptopenjdk/openjdk8:alpine-jre
WORKDIR /opt/app
ARG JAR_FILE=target/tensorflow_kotlin_example.jar
COPY ${JAR_FILE} app.jar
ADD ./ssd_mobilenet_v2_fpnlite_320x320_1 /opt/model/
ENTRYPOINT exec "java" "-Xms4096m" "-Xmx4096m" "-jar" "app.jar"