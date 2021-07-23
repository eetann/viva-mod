#!/bin/bash

#######################################################################
# Author: GwenDragon, <https://labs.gwendragon.de/blog/>
# License: GPL
#######################################################################

# 2021-06-25 removed custom.css support
#            commented custom.css shell commands
#            users can now use vivaldi://experiments to change CSS in UI

# TODO: Change mod_dir
mod_dir=$HOME/path/to/dir

vivaldi_installs=$(dirname $(find /opt -name "vivaldi-bin" )) ;
vivaldi_install_dirs=( $vivaldi_installs ) ;

echo "---------------------"
count=1
selected=0
echo "Installations found:"
for dir in $vivaldi_installs ; do
	echo $dir": "$count ;
	((count++)) ;
done
read -p "
Select installation to patch.
Input number and press [Enter] or [X] to cancel.
Input selection: " selected ;
if [ "$selected" = "X" ] ; then
	exit ;
fi
((selected--)) ;
if [ $selected -ge ${#vivaldi_install_dirs[@]} ] ; then
    echo "Selection too large!"
fi
dir=${vivaldi_install_dirs[$selected]} ;
echo "---------------------
"
echo "Patch originating from "${mod_dir}" targeting "${vivaldi_install_dirs[$selected]} ;

sudo cp "$dir/resources/vivaldi/browser.html" "$dir/resources/vivaldi/browser.html-$(date +%Y-%m-%dT%H-%M-%S)"

alreadypatched=$(grep '<script src="custom.js"></script>' $dir/resources/vivaldi/browser.html);
#alreadypatched=$(grep '<link rel="stylesheet" href="style/custom.css" />' $dir/resources/vivaldi/browser.html);
if [ "$alreadypatched" = "" ] ; then
    echo patching browser.html
	#sudo sed -i -e 's/<\/head>/<link rel="stylesheet" href="style\/custom.css" \/> <\/head>/' "$dir/resources/vivaldi/browser.html"
    	sudo sed -i -e 's/<\/body>/<script src="custom.js"><\/script> <\/body>/' "$dir/resources/vivaldi/browser.html"
else
        echo "browser.html has already been patched!"
fi

#if [ -f "$mod_dir/custom.css" ] ; then
#    echo copying custom.css
#    sudo cp -f "$mod_dir/custom.css" "$dir/resources/vivaldi/style/custom.css"
#else
#    echo custom.css missing in $mod_dir
#fi

if [ -f "$mod_dir/custom.js" ] ; then
    echo copying custom.js
    sudo cp -f "$mod_dir/custom.js" "$dir/resources/vivaldi/custom.js"
else
    echo custom.js missing in $mod_dir
fi
