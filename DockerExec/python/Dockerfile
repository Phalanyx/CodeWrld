FROM python
WORKDIR /app
ENV FILE_CONTENT="# Type your code here\nwhile True:\n        data=\"hi\""
ENV FILE_NAME="main"
ENV FILE_INPUT=""
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e \"$FILE_CONTENT\" > ${FILE_NAME}.py && echo -n -e \"$FILE_INPUT\" | python3 ${FILE_NAME}.py"]

