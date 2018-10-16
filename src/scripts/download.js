class DownloadCSV {
	  
	constructor (opts) {
		this.opts = opts;
		if(this.opts.parent){
			this.clickable();
		}
	}	
 
	download_csv() {
    let keys = Object.keys(this.opts.data[0]);
    let csv = keys.join(',');
    
    this.opts.data.forEach((row) =>{
    	let arr = Object.values(row);
            csv += arr.join(',');
            csv += '\n';
    });
 
    this.button = document.querySelector(this.opts.el);
    this.button.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    this.button.target = '_blank';
    this.button.download = 'hurricanes.csv';
    this.button.click();
	}

	clickable(){
		document.querySelector(this.opts.parent).addEventListener('click', ()=>{this.download_csv();});

	}

	update(data){
		this.opts.data = data;

	}


}

export { DownloadCSV };

