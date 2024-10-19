function list_child_processes () {
    local ppid=$1;
    local current_children=$(pgrep -P $ppid);
    local local_child;
    if [ $? -eq 0 ];
    then
        for current_child in $current_children
        do
          local_child=$current_child;
          list_child_processes $local_child;
          echo $local_child;
        done;
    else
      return 0;
    fi;
}

ps 43297;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 43297 > /dev/null;
done;

for child in $(list_child_processes 43299);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/nabidulislam/Desktop/Nabidul/University/Year 3, Semester 2/Dot NET Programming/Assessment 2/App-Dev-Assignment-2-1/ReactApp/ReactApp.Server/bin/Debug/net8.0/b929553a72ad4cdf90e6eb0e4879c76c.sh;
