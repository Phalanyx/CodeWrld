FROM openjdk:latest
WORKDIR /app
ENV FILE_CONTENT=""
ENV FILE_NAME="Main"
ENV FILE_INPUT=""
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.java && javac ${FILE_NAME}.java && echo -n -e $FILE_INPUT | java $FILE_NAME"]