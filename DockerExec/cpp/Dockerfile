FROM gcc:latest
WORKDIR /app
ENV FILE_CONTENT=""
ENV FILE_NAME="main"
ENV FILE_INPUT=""
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.cpp && g++ ${FILE_NAME}.cpp -o ${FILE_NAME} && echo -n -e $FILE_INPUT | ./${FILE_NAME}"]