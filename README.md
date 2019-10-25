# TextTestPP
TextTest++ for text entry experiments (using the T-seq model) and Throughput calculation 

### [Try it!](https://drustz.com/TextTestPP/)

This is a project associated with the paper [Beyond the Input Stream: Making Text Entry Evaluations More Flexible with Transcription Sequences](https://faculty.washington.edu/wobbrock/pubs/uist-19.01.pdf), with the Transcription Sequence Model (T-seq model). Also the paper [Text Entry Throughput: Towards Unifying Speed and Accuracy in a Single Performance Metric
](http://faculty.washington.edu/wobbrock/pubs/chi-19.03.pdf) for throughput calculation. This platform is used for conducting text entry experiments. The loggin file can
be directly plugged into the [throughput calculation](https://github.com/DrustZ/Throughput).

For details about how to use, please go to the page and read the tutorial. 

You can also host it offline, and customize the code according to your need.

## Algorithms
For algorithm implementations, please refer to [main.js](https://github.com/DrustZ/TextTestPP/blob/master/main.js). 

- INFER-ACTION algorithm: [here](https://github.com/DrustZ/TextTestPP/blob/b0b470e6eef66e8f37a6c8ea020f9efd628568f2/main.js#L271)

- Extended Needleman-Wunsch alignment algorithm for deteremining IFc and IFe: [here](https://github.com/DrustZ/TextTestPP/blob/b0b470e6eef66e8f37a6c8ea020f9efd628568f2/main.js#L462)

## Code Author

* [**Mingrui "Ray" Zhang**](http://drustz.com)

## Citation
If you use the code in your paper, then please cite it as:

```
@inproceedings{Zhang:2019:BIS:3332165.3347922,
 author = {Zhang, Mingrui Ray and Wobbrock, Jacob O.},
 title = {Beyond the Input Stream: Making Text Entry Evaluations More Flexible with Transcription Sequences},
 booktitle = {Proceedings of the 32Nd Annual ACM Symposium on User Interface Software and Technology},
 series = {UIST '19},
 year = {2019},
 isbn = {978-1-4503-6816-2},
 location = {New Orleans, LA, USA},
 pages = {831--842},
 numpages = {12},
 url = {http://doi.acm.org/10.1145/3332165.3347922},
 doi = {10.1145/3332165.3347922},
 acmid = {3347922},
 publisher = {ACM},
 address = {New York, NY, USA},
 keywords = {error rates, input stream, presented string, text entry evaluation, text entry metrics, transcribed string, transcription sequence, words per minute},
} 
```

For throughput calculation, if you used this platform, please considering cite this:
```
@inproceedings{mingrui2019tp,
  author    = {Mingrui “Ray” Zhang, Shumin Zhai, Jacob O. Wobbrock.},
  title     = "{Text Entry Throughput: Towards Unifying Speed and Accuracy in a Single Performance Metric.}",
  booktitle = {Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems},
  year      = 2019,
  url 		= {http://doi.acm.org/10.1145/3290605.3300866},
  doi 		= {10.1145/3290605.3300866},
  publisher = {ACM},
  address 	= {New York, NY, USA},
}
```
