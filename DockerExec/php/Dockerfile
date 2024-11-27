FROM php:latest
WORKDIR /app
ENV FILE_CONTENT=""
ENV FILE_NAME="main"
ENV FILE_INPUT=""
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.php && echo -n -e $FILE_INPUT | php ${FILE_NAME}.php"]