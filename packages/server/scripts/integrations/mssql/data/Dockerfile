FROM mcr.microsoft.com/mssql/server

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Passw0rd

COPY ./data /

ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]
CMD [ "/opt/mssql/bin/sqlservr" ]
