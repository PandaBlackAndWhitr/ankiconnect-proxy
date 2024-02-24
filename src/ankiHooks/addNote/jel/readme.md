Information on JMDict's JMdictDB Edit Language (JEL)
https://www.edrdg.org/jmwsgi/edhelp.py?svc=jmdict&sid=#geninfo

To get parts of speech:
- Copy text into `.txt` file: https://www.edrdg.org/jmwsgi/edhelp.py?svc=jmdict&sid=#kw_pos
```
$ awk '{print $1}' src/ankiHooks/addNote/jel/parts-of-speech.txt
```

With quotes: https://stackoverflow.com/a/12845216
```
$ awk '{print "\x27"$1"\x27"","}' src/ankiHooks/addNote/jel/parts-of-speech.txt
```
