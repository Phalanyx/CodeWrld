FROM dart:latest
WORKDIR /app
ENV FILE_CONTENT="void main() {\n  for (var i = 0; i < 10; i++) {\n    print(\"hello \${i + 1}\");\n  }\n}"
ENV FILE_NAME="main"
ENV FILE_INPUT=""
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.dart && echo -n -e $FILE_INPUT | dart ${FILE_NAME}.dart"]