
import * as fs from 'fs';
export class chargementDynamique
{
    charger(dir:string)
    {
        console.log('[chargementDynamique] ' + (dir + '/'));
        this.chargerRec(dir);
    }

    private chargerRec(dir:string)
    {
        //console.log(dir);
        var list = fs.readdirSync(dir);
        list.forEach(file => 
        {
            var stat = fs.statSync(dir + '/' + file);
            if (stat && stat.isDirectory()) {
                this.chargerRec(dir + '/' + file)
            }
            else
            {
                if (file.endsWith('.js'))
                {
                    console.log('[chargementDynamique] ' + dir + '/' + file);
                    //DynamicLoader.files.push(dir + '/' + file);
                    require(dir + '/' + file);
                }
            }
        });
    }
}