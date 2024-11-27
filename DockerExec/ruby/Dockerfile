FROM ruby:latest
WORKDIR /app
ENV FILE_CONTENT="puts 'Enter a number:'\\ndata = gets.chomp\\nputs 'You entered: ' + data"
ENV FILE_NAME="main"
ENV FILE_INPUT="hello\nyou\n"
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.rb && echo -n -e $FILE_INPUT | ruby ${FILE_NAME}.rb"]