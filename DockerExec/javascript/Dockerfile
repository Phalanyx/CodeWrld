FROM node:latest
WORKDIR /app
ENV FILE_CONTENT="const numbers = [1, 2, 3, 4, 5];\nconst sum = numbers.reduce((acc, num) => acc + num, 0);\nconsole.log(`The sum is: \${sum}`);"
ENV FILE_NAME="main"
ENV FILE_INPUT=""
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e \"$FILE_CONTENT\" > ${FILE_NAME}.js && echo -n -e \"$FILE_INPUT\" | node $FILE_NAME"]