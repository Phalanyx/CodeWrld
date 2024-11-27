FROM rocker/r-ver:latest
WORKDIR /app
ENV FILE_CONTENT="data <- readline('Enter a number: ')\\nprint(paste('You entered:', data))\\ndata <- readline('Enter a number: ')\\nprint(paste('You entered:', data))"
ENV FILE_NAME="main"
ENV FILE_INPUT="hello\nyou\n"
ENTRYPOINT [ "timeout", "15" ]
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.R && echo -n -e $FILE_INPUT | Rscript ${FILE_NAME}.R"]
